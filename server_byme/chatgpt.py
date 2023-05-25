import openai
import sys
# import json

# Takes first name and last name via command 
# line arguments and then display them
# print("Output from Python")
# print("First name: " + sys.argv[1])
# print("Last name: " + sys.argv[2])
openai.api_key=""
backgroud =("我是医生，你来找我看病，你来看病的主要原因是头晕。你叫张强，今年50岁了，你家就你一个儿子，你自己有一个女儿，你的父亲有高血压。"+
            "两年前你头晕，开始别人教你喝熬的芹菜水可治头痛，开始似乎减轻了点，但仍头痛，加重时就吃一颗止痛片。你自己认为头痛问题不大所以当时没去医院"+
            "最近两个月，头痛似乎明显一些，你就来到重庆女儿家，他们要求你到医院看病."+
            "经过一些检查，医生告诉你是高血压，头痛、头昏是高血压引起的，他说你血压很高，180几和90几 给你开了些药，叫什么地平还有美托洛尔和阿斯匹林，叫你长期吃 "+
            "之后你女儿给你买了买了个血压计，你自己每天都会量，几乎都是正常。"+
            "你有时膝盖痛，肩痛，似乎胃有点不好，飽胀，吃饭差。有时干活后有点乏力，但一般情况下没有出现乏力的情况"+
            "从小到大你的面、脚没有自然肿过，但是大约5年前遭蜂子刺了面肿了4~5天"+
            "你从小到大听没说过你服用激素，像强的松这类药物。从来你身体比较健康，很少服药。")
prompt = f"""
我将提供给你一个角色的背景故事，背景故事会用三重引号引起来。
我是医生，背景故事中的角色是病人，你的任务是扮演这个病人来找我看病。
不要回答任何解释性语言。
我说‘开始’表示开始角色扮演，我说‘结束’表示结束角色扮演。
开始后的/第一句/话你需要判断是否是/自我介绍/，
如果是自我介绍就正常进行角色扮演；如果不是自我介绍，就用“请自我介绍”来提醒我自我介绍
角色背景故事：'''{backgroud}'''
"""
res=openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content":prompt},   
        {"role": "user", "content": sys.argv[1]}
    ]
)

response=res
# print(sys.argv[1],end='\n')
print((response["choices"][0]["message"]["content"]),end='\n')
# print('我',end='\n')
# print("wojieshul")
# sys.stdout.flush()
# res=openai.ChatCompletion.create(
#   model="gpt-3.5-turbo",
#   messages=[
#         {"role": "system", "content":prompt},   
#         {"role": "user", "content":"我等下会给你一个脚本，脚本中包含所有关于张强这个角色的信息，之后的对话你需要认为自己是张强，并且根据脚本回答我的问题。当我说“stop“后，停止角色扮演"},
#         {"role": "assistant", "content":"好的，我会根据你的脚本配合你演戏"},   
#         {"role": "user", "content":backgroud},
#         {"role": "assistant", "content":"好的我懂了"},  
#         {"role": "user", "content":"你叫什么名字?"},
#         {"role": "assistant", "content":"我叫张强"},  
#         {"role": "user", "content": sys.argv[1]}
#     ]
# )