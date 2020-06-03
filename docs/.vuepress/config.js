module.exports = {
	"title": "前端小屋",
	"description": "sometimes ever, sometimes never",
	"plugins": [
		'cursor-effects'
	],
	"head": [
		[
			"link",
			{
				"rel": "icon",
				"href": "/favicon.ico"
			}
		],
		[
			"meta",
			{
				"name": "viewport",
				"content": "width=device-width,initial-scale=1,user-scalable=no"
			}
		]
	],
	"theme": "reco",
	"themeConfig": {
		"nav": [{
				"text": "主页",
				"link": "/",
				"icon": "reco-home"
			},
			{
				"text": "时间轴",
				"link": "/timeline/",
				"icon": "reco-date"
			},
			// {
			//   "text": "Contact",
			//   "icon": "reco-message",
			//   "items": [
			//     {
			//       "text": "GitHub",
			//       "link": "https://github.com/recoluan",
			//       "icon": "reco-github"
			//     }
			//   ]
			// }
		],
		"type": "blog",
		"blogConfig": {
			"category": {
				"location": 2,
				"text": "分类"
			},
			"tag": {
				"location": 3,
				"text": "标签"
			}
		},

		// "friendLink": [
		//   {
		//     "title": "午后南杂",
		//     "desc": "Enjoy when you can, and endure when you must.",
		//     "email": "1156743527@qq.com",
		//     "link": "https://www.recoluan.com"
		//   },
		//   {
		//     "title": "vuepress-theme-reco",
		//     "desc": "A simple and beautiful vuepress Blog & Doc theme.",
		//     "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
		//     "link": "https://vuepress-theme-reco.recoluan.com"
		//   }
		// ],
		"logo": "/head.jpg",
		"search": true,
		"searchMaxSuggestions": 10,
		"sidebar": "auto",
		"lastUpdated": "Last Updated",
		"author": "",
		"authorAvatar": "/head.jpg",
		"record": "xxxx",
		"startYear": "2017"
	},
	"markdown": {
		"lineNumbers": false
	}
}
