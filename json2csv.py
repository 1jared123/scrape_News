import json
import csv 

f = open('file.json')
data = json.load(f)
f.close()

#print(len(data['data']))

#print(data['data'][3]['uid'])

#for d in range(len(data['data'])):
#	print(data['data'][d]['uid'])

f=csv.writer(open('file.csv','wb+'))

for d in range(len(data['data'])):
	f.writerow(data['data'][d]['uid'].split())
