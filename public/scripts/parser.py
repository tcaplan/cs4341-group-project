import sys
import re

# get user input
user_input = sys.argv[1]

# do some cool processing here

# get word data
direction_words = {}
movement_words = {}
subject_words = {}

fp = open('public/scripts/direction_words.txt', 'r')
for line in fp.readlines():
    line = line.replace('\n', '')
    arr = line.rsplit('|')
    arr[0] = arr[0].lower()
    direction_words[arr[0]] = arr[1:]
fp.close()

fp = open('public/scripts/movement_words.txt', 'r')
for line in fp.readlines():
    line = line.replace('\n', '')
    arr = line.rsplit('|')
    arr[0] = arr[0].lower()
    movement_words[arr[0]] = arr[1:]
fp.close()

fp = open('public/scripts/subject_words.txt', 'r')
for line in fp.readlines():
    line = line.replace('\n', '')
    arr = line.rsplit('|')
    arr[0] = arr[0].lower()
    subject_words[arr[0]] = arr[1:]
fp.close()

condensed_input = []
reasoning = ""

for word in user_input.split(' '):
    word = word.lower()
    word = re.sub(r'[^A-Za-z0-9 ]+', '', word)
    if word in subject_words.keys():
        condensed_input.append(word)
        if subject_words[word][0] == "No":
            reasoning += subject_words[word][1] + "|"
    if word in movement_words.keys():
        condensed_input.append(word)
        if movement_words[word][0] == "No":
            reasoning += movement_words[word][1] + "|"
    if word in direction_words.keys():
        condensed_input.append(word)
        if direction_words[word][0] == "No":
            reasoning += direction_words[word][1] + "|"

if len(reasoning) > 0:
    reasoning = "NO|" + reasoning
else:
    reasoning = "YES"

output = reasoning

print(output)
  
sys.stdout.flush()