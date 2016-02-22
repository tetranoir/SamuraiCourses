import json

def main():
    f = open('all_subs', 'r')
    
    subs = []
    for line in f:
        subs.append([e.strip() for e in line.split('/', 1)])
    
    sub_abrvs, sub_names = zip(*subs)
    sub_abrvs = list(sub_abrvs)
    sub_names = list(sub_names)
    abrv_name = {}
    for sub in subs:
        abrv_name[sub[0]] = sub[1]
        
    properties = []
    for sub in subs:
        properties.append({'abrv':sub[0], 'name':sub[1], 'id':sub[1][0]})
    abrv_name['all_subjects'] = properties
    
    f_json = open('all_subs.json', 'w')
    f_json.write(json.dumps(abrv_name, sort_keys=True, indent=2))

if __name__ == '__main__':
    main()