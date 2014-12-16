/**
 * This is a base modal implementation that provides common utilities.
 */

define(["jquery", "underscore", "gettext", "js/views/baseview"],
    function($, _, gettext, BaseView) {
        var BaseModal = BaseView.extend({
            events : {
                'click .action-cancel': 'cancel',
            },

            options: $.extend({}, BaseView.prototype.options, {
                type: 'prompt',
                closeIcon: false,
                icon: false,
                modalName: 'basic',
                modalType: 'generic',
                modalSize: 'lg',
                title: ''
            }),

            initialize: function() {
                var parent = this.options.parent,
                    parentElement = this.options.parentElement;
                this.modalTemplate = this.loadTemplate('basic-modal');
                this.buttonTemplate = this.loadTemplate('modal-button');
                if (parent) {
                    parentElement = parent.$el;
                } else if (!parentElement) {
                    parentElement = this.$el.closest('.modal-window');
                    if (parentElement.length === 0) {
                        parentElement = $('body');
                    }
                }
                this.parentElement = parentElement;
            },

            render: function() {
                this.$el.html(this.modalTemplate({
                    name: this.options.modalName,
                    type: this.options.modalType,
                    size: this.options.modalSize,
                    title: this.options.title
                }));
                this.addActionButtons();
                this.renderContents();
                this.parentElement.append(this.$el);
            },

            renderContents: function() {
                var contentHtml = this.getContentHtml();
                this.$('.modal-content').html(contentHtml);
				
            },

            /**
             * Returns the content to be shown in the modal.
             */
            getContentHtml: function() {
                return '';
            },

            show: function() {
                this.render();
                this.resize();
                $(window).resize(_.bind(this.resize, this));
            },

            hide: function() {
                // Completely remove the modal from the DOM
                this.undelegateEvents();
                this.$el.html('');
            },

            cancel: function(event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation(); // Make sure parent modals don't see the click
                }
                this.hide();
            },

            /**
             * Adds the action buttons to the modal.
             */
            addActionButtons: function() {
                if (this.options.addSaveButton) {
                    this.addActionButton('save', gettext('Save'), true);
                }
                this.addActionButton('cancel', gettext('Cancel'));
            },

            /**
             * Adds a new action button to the modal.
             * @param type The type of the action.
             * @param name The action's name.
             * @param isPrimary True if this button is the primary one.
             */
            addActionButton: function(type, name, isPrimary) {
                var html = this.buttonTemplate({
                    type: type,
                    name: name,
                    isPrimary: isPrimary
                });
                this.getActionBar().find('ul').append(html);
            },

            /**
             * Returns the action bar that contains the modal's action buttons.
             */
            getActionBar: function() {
                return this.$('.modal-window > div > .modal-actions');
            },

            /**
             * Returns the action button of the specified type.
             */
            getActionButton: function(type) {
                return this.getActionBar().find('.action-' + type);
            },
			

            resize: function() {
                var top, left, modalWindow, modalWidth, modalHeight,
                    availableWidth, availableHeight, maxWidth, maxHeight;

                modalWindow = this.$('.modal-window');
                availableWidth = $(window).width();
                availableHeight = $(window).height();
                maxWidth = availableWidth * 0.80;
                maxHeight = availableHeight * 0.80;
                modalWidth = Math.min(modalWindow.outerWidth(), maxWidth);
                modalHeight = Math.min(modalWindow.outerHeight(), maxHeight);

                left = (availableWidth - modalWidth) / 2;
                top = (availableHeight - modalHeight) / 2;
				if(!window.SIZEs){
					
                modalWindow.css({
                    top: top + $(window).scrollTop(),
                    left: left + $(window).scrollLeft()
                   });
				}else
				{
					if(window.SIZEs==2){//选择文件框大小
						window.SIZEs=0;
					    modalWindow.css({
							top: 50,
							left: 200,
							width:520,
							height:500
						});
					this.$('.modal-header').css({
							width:370,
							height:40
					});
					this.$('.modal-content').css({
						
							width:490,
							height:370
					});
					
					ihtml='<div id="Tab">  <div class="Menubox">   <ul> <li id="menu1"  class="hover">Upload</li> <li id="menu2">Select</li> </ul> </div>';
					ihtml+=' <div class="Contentbox">   <div id="con_menu_1" class="hover"> <form class="upload-dialog"  enctype="multipart/form-data" action="#"> <p id="dialog-assetupload-description" class="message"></p>';
					ihtml+='<input type="file" name="file">  <div class="status-upload">  </div></form> ';
					ihtml+='</div><div id="con_menu_2" style="display:none"><h1>Search Uploaded File</h1><button class="button upload-button new-button">Search File</button></div>  </div></div> ';
					this.$('.modal-content').html(ihtml);
					this.$('.modal-actions').html('<h3 class="sr">Actions</h3><ul><li class="action-item"><a href="#" class="button action-primary action-upload disabled">Upload</a></li><li class="action-item"><a href="#" class="button  action-cancel">Cancel</a></li></ul>');
					window.FileContent=this.$('.modal-content');
					window.SelectWindow=modalWindow;
					window.FileAction=this.$('.modal-actions');
					}//window.SIZEs==2

					if(window.SIZEs==4){//选择图片框大小
						window.SIZEs=0;
						modalWindow.css({
						top: 50,
						left: 200,
						width:520,
						height:500
                    });
					this.$('.modal-header').css({
						
						width:370,
						height:40
					});
					this.$('.modal-content').css({
						
						width:490,
						height:370
					});

					
					ihtml='<div id="Tab">  <div class="Menubox">   <ul> <li id="menu1"  class="hover">Upload</li> <li id="menu2">Select</li> </ul> </div>';
					ihtml+=' <div class="Contentbox">   <div id="con_menu_1" class="hover"> <form class="upload-dialog"  enctype="multipart/form-data" action="#"> <p id="dialog-assetupload-description" class="message"></p>';
					ihtml+='<input type="file" accept="image/jpeg, image/png" name="file">  <div class="status-upload">  </div></form> ';
					ihtml+='</div><div id="con_menu_2" style="display:none"><h1>Search Uploaded Image</h1><button class="button upload-button new-button">Search Image</button></div>  </div></div> ';
           			this.$('.modal-content').html(ihtml);
					this.$('.modal-actions').html('<h3 class="sr">Actions</h3><ul><li class="action-item"><a href="#" class="button action-primary action-upload disabled">Upload</a></li><li class="action-item"><a href="#" class="button  action-cancel">Cancel</a></li></ul>');
					window.FileContent=this.$('.modal-content');
					window.SelectWindow=modalWindow;
					window.FileAction=this.$('.modal-actions');
					}//window.SIZEs==4
				}//!window.SIZEs
            }//resize
        });
		window.BaseModal=BaseModal;
        return BaseModal;
    });
