from django import template
import re
import markdown

register = template.Library()


@register.filter
def no_tex(content):
	# find and remove the latex
	tex_regex = re.compile(r'((\$+|\\begin\{(.*?)\}).*?(\$+|\\end\{\3\}))', re.S)
	content = re.sub(tex_regex, r'@@', content)

	# find and modify photo paths
	photo_regex = re.compile(r'!\[(.*?)\]\((.*?)\)')
	content = re.sub(photo_regex, r'<center><img src="/static/wikis/post_photos/\2" alt = "\1" style="max-height: 400px; max-width: 800px; height: auto; weight: auto;"></center>', content)

	print(content)
	return content


@register.filter
def replace_tex(content, original):
	tex_regex = re.compile(r'((\$+|\\begin\{(.*?)\}).*?(\$+|\\end\{\3\}))', re.S)
	tex_collection_list = re.findall(tex_regex, original) 		# list of tuples of tex
	tex_list = []
	for tex_collection in tex_collection_list:
		tex_of_interest = tex_collection[0]		# get just the first item in the tuple
		if tex_of_interest.startswith('\\'):	# add extra $$ for environments -- for KaTeX rendering
			tex_of_interest = '$$' + tex_of_interest + '$$'
		tex_list.append(tex_of_interest)
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