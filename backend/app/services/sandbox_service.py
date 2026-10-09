import sys
import os
import subprocess
import tempfile
import time
from typing import Dict, Any, List

TIMEOUT_SECONDS = 4.0

def execute_code(language: str, code: str, test_cases: List[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Executes Python or JavaScript code safely in an isolated subprocess with a 4s timeout limit.
    Optionally evaluates against test cases if provided.
    """
    language = language.lower()
    if language in ["py", "python"]:
        cmd_runner = [sys.executable]
        ext = ".py"
    elif language in ["js", "javascript", "node"]:
        cmd_runner = ["node"]
        ext = ".js"
    else:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Unsupported language '{language}'. Supported: Python, JavaScript.",
            "execution_time_ms": 0,
            "test_results": []
        }

    # If test cases are present and python, append standard runner code
    full_code = code
    if test_cases and language in ["py", "python"]:
        harness = "\n\n# --- TEST HARNESS ---\nimport json\n"
        for idx, tc in enumerate(test_cases):
            input_val = tc.get("input", "")
            harness += f"try:\n    res = solve({input_val})\n    print(f'__TC_{idx}__:' + json.dumps(res))\nexcept Exception as e:\n    print(f'__TC_{idx}_ERR__:' + str(e))\n"
        full_code += harness

    with tempfile.NamedTemporaryFile(suffix=ext, mode="w", delete=False, encoding="utf-8") as temp_file:
        temp_file.write(full_code)
        temp_file_path = temp_file.name

    start_time = time.time()
    try:
        proc = subprocess.run(
            cmd_runner + [temp_file_path],
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS
        )
        exec_time = int((time.time() - start_time) * 1000)
        stdout = proc.stdout or ""
        stderr = proc.stderr or ""
        success = (proc.returncode == 0)

        # Parse test results if present
        parsed_test_results = []
        if test_cases:
            stdout_lines = stdout.splitlines()
            clean_stdout = []
            for line in stdout_lines:
                if "__TC_" in line:
                    for idx, tc in enumerate(test_cases):
                        if f"__TC_{idx}__:" in line:
                            got = line.split(f"__TC_{idx}__:")[1].strip()
                            try:
                                # compare raw or parsed JSON
                                expected = str(tc.get("expected", "")).strip()
                                passed = (got == expected or repr(got) == expected or str(got) == repr(expected))
                            except Exception:
                                passed = False
                            parsed_test_results.append({
                                "case": idx + 1,
                                "input": tc.get("input"),
                                "expected": tc.get("expected"),
                                "got": got,
                                "passed": passed
                            })
                        elif f"__TC_{idx}_ERR__:" in line:
                            err_msg = line.split(f"__TC_{idx}_ERR__:")[1].strip()
                            parsed_test_results.append({
                                "case": idx + 1,
                                "input": tc.get("input"),
                                "expected": tc.get("expected"),
                                "got": f"Error: {err_msg}",
                                "passed": False
                            })
                else:
                    clean_stdout.append(line)
            stdout = "\n".join(clean_stdout)

        return {
            "success": success and (all(t.get("passed", False) for t in parsed_test_results) if parsed_test_results else True),
            "stdout": stdout,
            "stderr": stderr,
            "execution_time_ms": exec_time,
            "test_results": parsed_test_results
        }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Execution Timed Out after {TIMEOUT_SECONDS}s. Ensure your algorithm doesn't contain infinite loops.",
            "execution_time_ms": int(TIMEOUT_SECONDS * 1000),
            "test_results": []
        }
    except Exception as err:
        return {
            "success": False,
            "stdout": "",
            "stderr": str(err),
            "execution_time_ms": 0,
            "test_results": []
        }
    finally:
        if os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass
