/**
 * plugin.js
 *
 * Copyright 2013 Web Power, www.webpower.nl
 * @author Arjan Haverkamp
 */

/*jshint unused:false */
/*global tinymce:true */



tinymce.PluginManager.requireLangPack('fileuploadselect');

tinymce.PluginManager.add('fileuploadselect', function(editor, url) {

	 UploadDialog = window.UploadDialog;
	 FileUpload = window.FileUpload;

	
	function showFileUploadSelect(event) {
		window.SIZEs=2;
		window.TYPE=3;
		window.fileorimage=1;
		var self = SELF,
                target = $(event.currentTarget),
                url = '/assets/' + course_location_analytics + '/', // !!!
                model = new FileUpload({
                    title: gettext('File'),
                }),
                view = new UploadDialog({
                    model: model,
                    url: url,
                    parentElement: target.closest('.edit-xblock-modal'), // !!!
                    onSuccess: function (response) {
                        if (response['asset'] && response['asset']['url']) {
                           // self.model.setValue(response['asset']['url']);
                        }
                    }
                }).show();
			 window.Editor=editor;






	}

	// Add a button to the button bar
    // EDX changed to show "HTML" on toolbar button
	editor.addButton('fuploadselect', {
		title: 'Upload Select',
        text: 'File',
		icon: false,
		onclick: showFileUploadSelect
	});

	// Add a menu item to the tools menu
	editor.addMenuItem('fuploadselect', {
		icon: 'code',
		text: 'Upload Select',
		context: 'tools',
		onclick: showFileUploadSelect
	});
});



