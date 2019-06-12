
import os
from waas_client import WAAS


if not isinstance(os.environ.get('API'), str):
    print('NO API')
    exit(1)

bot = WAAS(os.environ.get('API'))
for msg in bot.message():
    print(msg)
    exit(0)
