Author: doem1997

# Exp Finish Script (Shell)

This script sends a Telegram message when an experiment is finished.

1. Add this to ~/lib/utils.sh:

```bash
#!/bin/bash

send_telegram_notification() {
    local MESSAGE="$1"
    local BOT_TOKEN="YOUR_BOT_TOKEN_HERE"
    local CHAT_ID="YOUR_CHAT_ID_HERE"

    curl -s -X POST https://api.telegram.org/bot${BOT_TOKEN}/sendMessage \
        -d chat_id=${CHAT_ID} \
        -d text="${MESSAGE}" \
        >/dev/null 2>&1
}
```

2. Add to .bashrc or .zshrc:

```bash
source ~/lib/utils.sh
```

3. Send a notification:

```bash
send_telegram_notification "Experiment finished"
```

# Exp Finish Script (Python)

1. Add following to your `utils/err_handler.py`:

```python
import sys
import signal
import requests
import ipdb


def send_telegram_notification(message):
    bot_token = "YOUR_BOT_TOKEN_HERE"
    chat_id = "YOUR_CHAT_ID_HERE"
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {"chat_id": chat_id, "text": message}
    try:
        requests.post(url, json=payload)
    except Exception as e:
        print(f"Failed to send Telegram notification: {e}")


def excepthook(type, value, traceback, debug=True):
    error_message = f"An error occurred: {value}"
    print(error_message)
    send_telegram_notification(error_message)

    if debug:
        print("Entering debugging environment...")
        ipdb.post_mortem(traceback)
    else:
        print("Debug mode is off, won't enter debugging environment.")


def signal_handler(signum, frame):
    print("Interrupt received, exiting...")
    sys.exit(0)


def setup_error_handler(debug=True):
    sys.excepthook = lambda type, value, tb: excepthook(type, value, tb, debug)
    signal.signal(signal.SIGINT, signal_handler)


# Example usage
if __name__ == "__main__":
    setup_error_handler(debug=True)
    # Your main program code here
    # For example, to test the error handler:
    # raise Exception("Test error")
```

2. Call the util in your python code:

```python
###############################################################################
# Setup: Logger, Exception Handling (Exit Signal), and Global Seeds
###############################################################################
from utils.err_handler import setup_error_handler

# Read DEBUG_MODE from system environment
DEBUG_MODE = os.environ.get("DEBUG_MODE", "False").lower() == "true"

setup_error_handler(debug=DEBUG_MODE)
```
