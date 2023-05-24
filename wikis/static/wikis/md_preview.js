import latexMacros from './latex_macros.json' assert { type: 'json' };

const titleArea = document.querySelector(".textinput.form-control");
const previewTitle = document.querySelector(".new-title");
const editArea = document.querySelector(".textarea.form-control");
const preview = document.querySelector(".preview");

titleArea.addEventListener("keyup", evt => {
	const {value} = evt.target;

	previewTitle.innerHTML = value;
});

editArea.addEventListener("keyup", evt => {
	const {value} = evt.target;

	const photo_reg = /!\[(.*?)\]\((.*?)\)/gs;
	const tex_reg = /(\$+|\\begin\{(.*?)\}).*?(\$+|\\end\{\2\})/gs;
	const tex_array = value.match(tex_reg);

	const no_tex = value.replaceAll(tex_reg, '@@');

	const with_photos = no_tex.replaceAll(photo_reg, '<center><img src="/static/wikis/post_photos/$2" alt = "$1" style="max-height: 200px; max-width: 400px; height: auto; width: auto;"></center>');

	const marked_text = marked.parse(with_photos, {mangle: false, headerIds: false});

	const content_array = marked_text.split('@@');

	var final_text = '';

	if (tex_array != null) {
		const iterations = Math.min(content_array.length - 1, tex_array.length);

		for (var i = 0; i < iterations; i++) {
			if (tex_array[i].startsWith('\\')) {
				tex_array[i] = '$$' + tex_array[i] + '$$';
			}
			final_text += content_array[i];
			final_text += tex_array[i];
		}

		final_text += content_array.at(-1);

		preview.innerHTML = final_text;
	} else {
		preview.innerHTML = marked_text;
	}
});

editArea.addEventListener("keyup", function() {
    renderMathInElement(preview, {
      	delimiters: [
	    	{left: '$$', right: '$$', display: true},
	        {left: '$', right: '$', display: false},
	        {left: '\\(', right: '\\)', display: false},
	        {left: '\\[', right: '\\]', display: true}
	    ],
	    macros: latexMacros,
      	throwOnError : false
    });
});
