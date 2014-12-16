define(["jquery", "underscore", "gettext", "js/views/modals/base_modal", "jquery.form"],
    function($, _, gettext, BaseModal) {
        var UploadDialog = BaseModal.extend({
            events: {
                "change input[type=file]": "selectFile",
                "click .action-upload": "upload",
				"click .new-button": "search",
				"click .select-file": "selectfile",
				"click .select-image": "selectimage",
				"click #menu1":"menu1",
				"click #menu2":"menu2",
				"click .file-action-upload":"fileupload",
            },

            options: $.extend({}, BaseModal.prototype.options, {
                modalName: 'assetupload',
                modalSize: 'med',
                successMessageTimeout: 1000 // 2 seconds
            }),

            initialize: function() {
                BaseModal.prototype.initialize.call(this);
                this.events = _.extend({}, BaseModal.prototype.events, this.events);
                this.template = this.loadTemplate("upload-dialog");
                this.listenTo(this.model, "change", this.renderContents);
                this.options.title = this.model.get('title');
			
            },

            addActionButtons: function() {
				
                this.addActionButton('upload', gettext("Upload"), true);
				
                BaseModal.prototype.addActionButtons.call(this);
            },

            renderContents: function() {
                var isValid = this.model.isValid(),
                    selectedFile = this.model.get('selectedFile'),
                    oldInput = this.$("input[type=file]").get(0);
                BaseModal.prototype.renderContents.call(this);
                // Ideally, we'd like to tell the browser to pre-populate the
                // <input type="file"> with the selectedFile if we have one -- but
                // browser security prohibits that. So instead, we'll swap out the
                // new input (that has no file selected) with the old input (that
                // already has the selectedFile selected). However, we only want to do
                // this if the selected file is valid: if it isn't, we want to render
                // a blank input to prompt the user to upload a different (valid) file.
				
                if (selectedFile && isValid) {
                    $(oldInput).removeClass("error");
                    this.$('input[type=file]').replaceWith(oldInput);
                    this.$('.action-upload').removeClass('disabled');
                } else {
                    this.$('.action-upload').addClass('disabled');
                }
								
                return this;
            },

            getContentHtml: function() {
                return this.template({
                    url: this.options.url || CMS.URL.UPLOAD_ASSET,
                    message: this.model.escape('message'),
                    selectedFile: this.model.get('selectedFile'),
                    uploading: this.model.get('uploading'),
                    uploadedBytes: this.model.get('uploadedBytes'),
                    totalBytes: this.model.get('totalBytes'),
                    finished: this.model.get('finished'),
                    error: this.model.validationError
                });
            },

            selectFile: function(e) {
                this.model.set({
                    selectedFile: e.target.files[0] || null
                });
            },

            upload: function(e) {
                if (e && e.preventDefault) { e.preventDefault(); }
                this.model.set('uploading', true);
                this.$("form").ajaxSubmit({
                    success: _.bind(this.success, this),
                    error: _.bind(this.error, this),
                    uploadProgress: _.bind(this.progress, this),
                    data: {
                        // don't show the generic error notification; we're in a modal,
                        // and we're better off modifying it instead.
                        notifyOnError: false
                    }
                });
            },
			fileupload:function(e) {
				if (e && e.preventDefault) { e.preventDefault(); }
                this.model.set('uploading', true);
                this.$("form").ajaxSubmit({
					type: 'post', 
					url: this.options.url, 
                    success: _.bind(this.success, this),
                    error: _.bind(this.error, this),
                    uploadProgress: _.bind(this.progress, this),
                    data: {
                        // don't show the generic error notification; we're in a modal,
                        // and we're better off modifying it instead.
                        notifyOnError: false
                    }
                });
			},

			search: function(e) {
			// alert(this.options.url);
			 $.getJSON(this.options.url, function(json) {
						if(window.fileorimage==1){
						shtml = '<table id="Tablecss"><thead><tr> <th >select button </th> <th >preview image</th><th >filename</th></tr></thead>';
						window.FileSet=json;
						if(json.totalCount==0)
							alert('no file here,please upload first file!');
						for(i=0;i<json.totalCount;i++)
						 {
							shtml += '<tr onmouseover="this.style.backgroundColor=';
							shtml +='#ffff66';
							shtml +=';" onmouseout="this.style.backgroundColor=';
							shtml +='#d4e3e5';    
							shtml +=';"><td><input type="checkbox" name="select-checkbox"></input></td>';
							finame=json.assets[i].display_name;
							fimagetype=finame.substring(finame.lastIndexOf("."));
							if(fimagetype==".png"||fimagetype==".jpg"||fimagetype==".jpeg"){
							shtml +='<td><img width="70" height="70" src="';
							shtml +=json.assets[i].url;
							shtml +='"></img></td>';
							}else{
							shtml +='<td></td>';
							}
							shtml +='<td >'+json.assets[i].display_name+'</td>';
							shtml +='</tr>';
						}
					   shtml +='</table>';
					   FileContent=window.FileContent;
					   FileContent.html(shtml);
                        
					 }else{//if(window.fileorimage==1)ÎÄ¼þ
					if(window.fileorimage==2){
						var ImageSet={};
						var imageasset=[];
						tablehtml = '<table id="Tablecss"><thead><tr> <th >select button </th> <th >preview image</th> <th >filename</th></tr></thead>';
						ImageNum=0;
						for(i=0;i<json.totalCount;i++)
						 {
							imageName=json.assets[i].display_name;
							imagetype=imageName.substring(imageName.lastIndexOf("."));
							if(imagetype==".png"||imagetype==".jpg"||imagetype==".jpeg")//iamgeNameÎªjpg,png,jpeg
							 {
								//ImageSet.assets[ImageNum]=json.assets[i];
								imageasset[ImageNum]=json.assets[i];
								ImageNum++;
							 }
						 }
						ImageSet.assets=imageasset;
						ImageSet.ImageNum=ImageNum;
						window.ImageSet=ImageSet;
						if(ImageNum==0)
							alert('no Image here,please upload first image!');
						for(i=0;i<ImageNum;i++)
						{
							tablehtml += '<tr ><td><input type="checkbox" name="select-checkbox"></input></td>';
							tablehtml +='<td><img width="70" height="70" src="';
							tablehtml +=ImageSet.assets[i].url;
							tablehtml +='"></img></td>';
							tablehtml +='<td >'+ImageSet.assets[i].display_name+'</td>';
							tablehtml +='</tr>';
						}
						tablehtml +='</table>';
						FileContent=window.FileContent;
					    FileContent.html(tablehtml);

						 }//if(window.fileorimage==2)Í¼Ïñ
					}//else
				});
			},

			selectfile: function(e) {
				FileSet=window.FileSet;
				checks=document.getElementsByName("select-checkbox");
				Editor=window.Editor;
				dom = Editor.dom;
				selectnum=0;
				for(i=0;i<FileSet.totalCount;i++)
				{
					if(checks[i].checked)
					{
						selectnum=selectnum+1;
						var linkAttrs = {
						href: FileSet.assets[i].url					
						};
						var linkAttrs1 = {
						};
						innhtml='&nbsp;&nbsp;&nbsp;&nbsp;';
						Editor.insertContent(dom.createHTML('a', linkAttrs, dom.encode(FileSet.assets[i].display_name)));
						Editor.insertContent(dom.createHTML('span', linkAttrs1,innhtml));					
					}
				}
				if(selectnum==0)
				{
					alert('Please Select Files!!');
				}else{
				this.hide();
				}
			
			},

			selectimage: function(e) {
			
				ImageSet=window.ImageSet;
				checks=document.getElementsByName("select-checkbox");
				Editor=window.Editor;
				dom = Editor.dom;
				selectnum=0;
				for(i=0;i<ImageSet.ImageNum;i++)
				{
					if(checks[i].checked)
					{
						selectnum=selectnum+1;
						var linkAttrs = {
						src: ImageSet.assets[i].url,
						alt: 'Image'
						};
						var linkAttrs1 = {
						};
						innhtml='&nbsp;&nbsp;&nbsp;&nbsp;';
						Editor.insertContent(dom.createHTML('img', linkAttrs));
						Editor.insertContent(dom.createHTML('span', linkAttrs1,innhtml));				
					}
					
				}
				if(selectnum==0)
				{
					alert('Please Select Images!!');
				}else{
				this.hide();
				}
			
			},
			setTab: function(name,cursel,n){
				for(i=1;i<=n;i++){
				var menu=document.getElementById(name+i);
				var con=document.getElementById("con_"+name+"_"+i);
				menu.className=i==cursel?"hover":"";
				con.style.display=i==cursel?"block":"none";
			}
		},
			menu1: function()
			{
				this.setTab('menu',1,2);
				FileAction=window.FileAction;
				FileAction.html('<h3 class="sr">Actions</h3><ul><li class="action-item"><a href="#" class="button action-primary action-upload disabled">Upload</a></li><li class="action-item"><a href="#" class="button  action-cancel">Cancel</a></li></ul>');

			},
			menu2: function()
			{
				this.setTab('menu',2,2);
				FileAction=window.FileAction;
				if(window.fileorimage==2){
					FileAction.html('<h3 class="sr">Actions</h3><ul><li class="action-item"><a href="#" class="button action-primary select-image">Select Image</a></li><li class="action-item"><a href="#" class="button  action-cancel">Cancel</a></li></ul>');
				}else{
					if(window.fileorimage==1)
					{
						FileAction.html('<h3 class="sr">Actions</h3><ul><li class="action-item"><a href="#" class="button action-primary select-file">Select File</a></li><li class="action-item"><a href="#" class="button  action-cancel">Cancel</a></li></ul>');
					}//if(window.fileorimage==1)
				}//else
				
			},

            progress: function(event, position, total) {
                this.model.set({
                    "uploadedBytes": position,
                    "totalBytes": total
                });
            },

            success: function(response, statusText, xhr, form) {
                this.model.set({
                    uploading: false,
                    finished: true
                });
                if (this.options.onSuccess) {
                    this.options.onSuccess(response, statusText, xhr, form);
                }
                var that = this;
                this.removalTimeout = setTimeout(function() {
                    that.hide();
                }, this.options.successMessageTimeout);
		if(window.TYPE==3){
			window.TYPE=0;
			Editor=window.Editor;
			dom = Editor.dom;
			var linkAttrs = {
			href: response.asset.url					
			};
			Editor.insertContent(dom.createHTML('a', linkAttrs, dom.encode(response.asset.display_name)));
			}	
		if(window.TYPE==4){
			window.TYPE=0;
			Editor=window.Editor;
			dom = Editor.dom;
			var linkAttrs = {
				src: response.asset.url,
				alt: 'Image'
			};
			Editor.insertContent(dom.createHTML('img', linkAttrs));
			}		
            },

            error: function() {
                this.model.set({
                    "uploading": false,
                    "uploadedBytes": 0,
                    "title": gettext("We're sorry, there was an error")
                });
		window.TYPE=0;
		window.SIZEs=0;
            }
        });
		
	window.UploadDialog=UploadDialog;
        return UploadDialog;
    }); // end define()
