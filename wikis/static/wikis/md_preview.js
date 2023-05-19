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

	const tex_reg = /(\$+|\\begin\{(.*?)\}).*?(\$+|\\end\{\2\})/gs;
	tex_array = value.match(tex_reg);

	no_tex = value.replaceAll(tex_reg, '@@');

	marked_text = marked.parse(no_tex, {mangle: false, headerIds: false});

	content_array = marked_text.split('@@');

	final_text = '';

	if (tex_array != null) {
		const iterations = Math.min(content_array.length - 1, tex_array.length);

		for (i = 0; i < iterations; i++) {
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
	    macros: {
	        "\\Ts": "\\mathcal{T}_{\\text{std}}",
	        "\\R":"\\mathbb{R}",
	        "\\N":"\\mathbb{N}",
	        "\\Z":"\\mathbb{Z}",
	        "\\Q":"\\mathbb{Q}",
	        "\\F":"\\mathbb{F}",
	        "\\C":"\\mathbb{C}",
	        "\\Even":"\\mathbb{E}",
	        "\\Odd":"\\mathbb{O}",
	        "\\Poly":"\\mathcal{P}",
	        "\\st":"\\text{ s.t. }",
	        "\\T":"\\mathcal{T}",
	        "\\Ts":"\\mathcal{T}_\\text{std}",
	        "\\Rs":"\\mathbb{R}_\\text{std}",
	        "\\inv":"^{-1}",
	        "\\dg":"\\^{circ}",
	        "\\B":"\\mathscr{B}",
	        "\\BLL":"\\mathcal{B}_\\text{LL}",
	        "\\RLL":"\\mathbb{R}_\\text{LL}",
	        "\\TLL":"\\mathcal{T}_\\text{LL}",
	        "\\Rh":"\\mathbb{R}_\\text{har}",
	        "\\Hbub":"\\mathbb{H}_\\text{bub}",
	        "\\Zar":"\\mathbb{Z}_\\text{arith}",
	        "\\lcm":"\\text{lcm}",
	        "\\Sub":"\\mathscr{S}",
	        "\\Cl":"\\text{Cl}",
	        "\\Span":"\\text{span}",
	        "\\Lin":"\\mathcal{L}",
	        "\\nl":"\\text{null }",
	        "\\range":"\\text{range }",
	        "\\M":"\\mathcal{M}",
	        "\\Sym":"\\text{Sym}",
	        "\\Aut":"\\text{Aut}",
	        "\\im":"\\text{im}",
	        "\\inn":"\\text{Inn}",
	        "\\id":"\\text{id}",
	        "\\stirlingI":"\\genfrac{[}{]}{0pt}{}{#1}{#2}",
	        "\\stirlingII":"\\genfrac{\\{}{\\}}{0pt}{}{#1}{#2}",
	        "\\Cov":"\\mathscr{C}",
	        "\\im":"\\text{im}",
	        "\\pring":"{#1}[{#2}]",
	        "\\V":"\\mathbf{V}",
	        "\\I":"\\mathbf{I}",
	        "\\Tor":"\\mathbb{T}",
	        "\\Sp":"\\mathbb{S}",
	        "\\RP":"\\mathbb{R}\\text{P}"
      	},
      	throwOnError : false
    });
});
