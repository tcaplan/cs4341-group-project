import os
from os.path import join, dirname
from dotenv import load_dotenv
import sys
from openai import AsyncOpenAI
import re
import asyncio
from pathlib import Path

path = Path(dirname(__file__))
dotenv_path = join(path.parent.parent.absolute(), '.env')
load_dotenv(dotenv_path)

client = AsyncOpenAI(
    api_key=os.environ.get('OPEN_AI_KEY'),
)

user_input = sys.argv[1]

async def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]

    response = await client.chat.completions.create(
        messages=messages,
        model=model
    )

    return response.choices[0].message.content.strip()

async def main() -> None:

    prompt_with_user_input = f"""You are given a robot that only has 4 wheels. It can drive forward, backward, and turn. The robot has to go around a corner.

    Given the following prompt from a user to the robot, say if the prompt describes the motion of the robot in too vague terms or not, and if it is vague explain why and give a suggestion. Start the response with Yes or No meaning not value or vague respectively:

    {user_input}"""

    response = await get_completion(prompt_with_user_input)

    print(response)

asyncio.run(main())

