# DebugMCP - Debugging Instructions Guide

⚠️  **CRITICAL INSTRUCTIONS - FOLLOW THESE STEPS:**
1. **FIRST:** Use 'add_breakpoint' to set an initial breakpoint at a starting point
2. **THEN:** Use 'start_debugging' tool to start debugging
3. **FINALLY:** Use repetitively all the other tools to navigate and inspect step by step

## 📋 DETAILED INSTRUCTIONS:
- **Before debugging:** Set at least one breakpoint in your code
- **Start debugging:** Launch the debug session with proper configuration (the program will immediatly start on the first breakpoint)
- **During debugging:** Use stepping commands to move through code execution
    - **Navigate:** Use stepping commands to move through code execution
    - **Inspect:** Check variables and evaluate expressions when needed
    - **Continue:** Use continue_execution to run until next breakpoint
- **When reach the root cause:** If you passed the problematic line and need to step back:
    1. stop the debug session
    2. set breakpoint in the problematic line
    3. restart the debug session.
- **When reach the root cause:** If you passed the problematic line and need to step back:

## Breakpoint Strategy Guide

🎯 **BREAKPOINT STRATEGY:**
- Set breakpoints inside the function body and not on the signature or definition line itself (e.g "def" in python)
- Place breakpoints only on executable lines (avoid comments, empty lines)
- Set breakpoints before loops or conditionals  
- Set breakpoints at variable assignments you want to inspect
- Set breakpoints at error-prone areas
- Set breakpoints at the start of functions to inspect parameters
- Use conditional breakpoints for loops that iterate many times
- Set breakpoints before and after critical operations

### Effective Breakpoint Placement:
- **Function entry points:** To inspect incoming parameters
- **Variable assignments:** To see values being set
- **Conditional branches:** Before if/else statements
- **Loop boundaries:** Before and after loops
- **Error handling:** In catch blocks and error conditions
- **Return statements:** To inspect final values

## Common Patterns:
❌ **COMMON MISTAKE:** Starting debugging without breakpoints
✅ **BEST PRACTICE:** Always set an initial breakpoint before starting debugging
❌ **COMMON MISTAKE:** Set breakpoint in a method signature/definition line
✅ **BEST PRACTICE:** Set breakpoint in the method body