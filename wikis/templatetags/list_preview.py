from django import template
import re
import markdown

register = template.Library()

# for any text to be rendered by KaTeX, change _ to @@, * to ~~, and ** to ``
# not a great solution content being passed in can't have more than 10 underscores
# within $ tags, can't use underscores outside of $ tags

'''
@register.filter
def remove_baddies(content):
	tex_underscore = re.compile(r'(\$+[^\$]*?)_(.*?\$+)')
	tex_asterisk = re.compile(r'(\$+[^\$]*?)\*(.*?\$+)')
	tex_d_asterisk = re.compile(r'(\$+[^\$]*?)\*\*(.*?\$+)')
	new_content = content
	for i in range(10):
		new_content = re.sub(tex_underscore, r'\1@@\2', new_content)
		new_content = re.sub(tex_d_asterisk, r'\1``\2', new_content)
		new_content = re.sub(tex_asterisk, r'\1~~\2', new_content)
	print(new_content)
	return new_content


@register.filter
def insert_baddies(content):
	new_content = re.sub(re.compile(r'@@'), r'_', content)
	new_content = re.sub(re.compile(r'~~'), r'*', new_content)
	new_content = re.sub(re.compile(r'``'), r'**', new_content)
	print('\n', new_content)
	return new_content


@register.filter
def test_1(content):
	return "HERE!" + content.upper()

@register.filter
def test_2(content, argument):
	return content[:10] + argument

'''

@register.filter
def no_tex(content):
	tex_regex = re.compile(r'(\$+.*?\$+)')
	return re.sub(tex_regex, r'@@', content)

@register.filter
def replace_tex(content, original):
	tex_regex = re.compile(r'(\$+.*?\$+)')
	tex_list = re.findall(tex_regex, original)
	content = re.sub(re.compile(r'<h2>'), r'<h6 class="card-subtitle mb-2 text-secondary">', content)
	content = re.sub(re.compile(r'<p>'), r'<p style="font-size: .8em">', content)
	print(content)
	split_content = content.split('@@')
	new_content = ''
	for i in range(min(len(split_content) - 1, len(tex_list))):
		new_content += split_content[i]
		new_content += tex_list[i]
	new_content += split_content[-1]
	return new_content

'''

@register.filter
def replace_tex(content, original_content):
	tex_regex = re.compile(r'(\$+.*?\$+)')
	tex_list = re.findall(tex_regex, original_content)
	tex_was_there = re.compile(r'@@')
	new_content = content
	new_content = re.sub(tex_was_there, tex_list[1].encode('utf-8').decode('unicode_escape'), new_content, 1)
	return new_content

'''