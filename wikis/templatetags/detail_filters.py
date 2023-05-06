from django import template
import re
import markdown

register = template.Library()


@register.filter
def no_tex(content):
	tex_regex = re.compile(r'(\$+.*?\$+)')
	return re.sub(tex_regex, r'@@', content)


@register.filter
def replace_tex(content, original):
	tex_regex = re.compile(r'(\$+.*?\$+)')
	tex_list = re.findall(tex_regex, original)
	content = re.sub(re.compile(r'<h2>'), r'<p></p><h3>', content)
	content = re.sub(re.compile(r'<h4>'), r'<p></p><h4>', content)
	print(content)
	split_content = content.split('@@')
	new_content = ''
	for i in range(min(len(split_content) - 1, len(tex_list))):
		new_content += split_content[i]
		new_content += tex_list[i]
	new_content += split_content[-1]
	return new_content