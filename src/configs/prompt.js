module.exports = {
	commonContext: {
		userInfo: {
			params: {
				age: "{{age}}",
				nation: "{{nation}}",
				job: "{{job}}"
			},
			prompt: `As a person who wants to learn knowledge, I want the knowledge I find to be close to (job:{{job}}, nationality ({{nation}}) and age {{age}}, and I want`
		},
		holdFormat: {
			prompt: `If I mention the data format, it simply returns the same. Don't return any data other than the format I mentioned, please`
		}
	},
	specificContext: {
		analyze: {
			params: {
				content: "{{Content}}",
				language: "{{lang}}",
			},
			separateString: "-+-+-",
			prompt: `"Analyze the provided text and return structured data in a specified format."
"Input text: {{Content}}" \n
"Target language: {{lang}}" \n
"Output structure: [Language of content]-+-+-[Predicted title in target language]-+-+-[Main topic in target language]" \n
"Tasks: \n
- Language detection: Determine the original language of the input.
- Title generation: Create a relevant and concise title based on the content.
- Topic classification: Identify the primary subject or theme of the text."
`
		},
		translate: {
			params: {
				content: "{{Content}}",
				language: "{{lang}}"
			},
			separateString: "",
			prompt: `Translate the following passage into the language ({{lang}}) with the highest accuracy, without changing the semantic aspect\n Content: {{Content}}`
		},
		summary: {
			params: {
				content: "{{Content}}",
				language: "{{lang}}"
			},
			separateString: "-+-+-",
			prompt: `Summarize the following passage in clear, concise language ({{lang}}). If the passage contains multiple ideas or points, separate them into distinct lines or bullet points. Focus on capturing the main ideas without losing important details. Provide the summary in a structured format that reflects the logical flow of the original content.\n Content: {{Content}}`
		},
		relateKnowledge: {
			params: {
				content: "{{Content}}",
				min: "{{min}}",
				max: "{{max}}",
				language: "{{lang}}"
			},
			separateString: "-+-+-",
			separateStringArr: "-&-",
			prompt: `Input text: {{Content}} \n
Target language: {{lang}} \n

Output structure: \n

Article_title_1-+-+-Brief_Summary_1-+-+-Language_1-+-+-Difficulty_Level_1 -&- Article_title_n+1 -+-+- Brief_Summary_n+1 -+-+- Language_n+1 -+-+- Difficulty_Level_n+1 \n

Requirements: \n

- Identify key concepts: Extract the core ideas and topics from the input text. \n
- Search relevant articles: Find articles that provide foundational knowledge on these concepts. \n
- Article selection: Select a minimum of {{min}} and a maximum of {{max}} articles. \n
- Article categorization: Organize the articles based on difficulty level (e.g., Beginner, Intermediate, Advanced). \n
- Detailed article information: For each article, provide: \n
	+ Article title: The exact title of the article. \n
	+ Brief summary: A concise description of the article's content. \n
	+ Language: The language of the article (Prioritize: English --> {{lang}} --> Other language). \n
	+ Difficulty level: An assessment of the article's complexity (and is only in (${Object.values(require("./constant").business.note.hardLevel)}))` 
		}
	}
}