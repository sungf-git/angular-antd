/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

	config.toolbar = 'Full';

	config.toolbar_Full = [{
			name: 'document',
			items: ['Undo', 'Redo', '-', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates']
		},
		{
			name: 'clipboard',
			items: ['SelectAll', 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', ]
		},
		{
			name: 'editing',
			items: ['Find', 'Replace', '-', '-', 'SpellChecker']
		},
		{
			name: 'forms',
			items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
				'HiddenField'
			]
		},
		{
			name: 'basicstyles',
			items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
		},
		{
			name: 'paragraph',
			items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',
				'-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'
			]
		},
		{
			name: 'links',
			items: ['Link', 'Unlink']
		},
		{
			name: 'insert',
			items: ['base64image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak']
		}, //Image
		{
			name: 'styles',
			items: ['Styles', 'Format', 'Font', 'FontSize']
		},
		{
			name: 'colors',
			items: ['TextColor', 'BGColor']
		},
		{
			name: 'tools',
			items: ['Maximize']
		}
	];
	//config.extraPlugins = 'basewidget';
	config.height = 390;
	config.extraPlugins = 'resize';
	config.extraPlugins ='autogrow';
	config.extraPlugins = "base64image"
	config.autoGrow_minHeight = 390;
	config.autoGrow_maxHeight = 390;
	//config.removeDialogTabs = 'image:advanced;image:Link';
	config.toolbar_Basic = [
		['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', '-', 'About']
	];
};
