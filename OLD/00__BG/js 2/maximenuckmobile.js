/**
 * @copyright	Copyright (C) 2012 Cedric KEIFLIN alias ced1870
 * http://www.joomlack.fr
 * Module Maximenu CK
 * @license		GNU/GPL
 * */

(function($) {
	$.fn.MobileMaxiMenu = function(options) {
		var defaults = {
			useimages: false,
			container: 'body',
			showdesc: false,
			showlogo: true,
			usemodules: false,
			menuid: '',
			titletag: 'h3',
			displaytype: 'flat',
			displayeffect: 'normal'
		};

		var opts = $.extend(defaults, options);
		var menu = this;

		return menu.each(function(options) {
			if ($('#' + opts.menuid + '-mobile').length)
				return;
			if (menu.prev(opts.titletag))
				menu.prev(opts.titletag).addClass('hidemenumobileck');
			updatelevel(menu);
			mobilemaximenuinit();
			if (opts.displaytype == 'accordion')
				mobilemaximenuSetAccordeon();

			function mobilemaximenuinit() {
				var activeitem, logoitem;
				if ($('.maxipushdownck', menu).length) {
					var menuitems = $(sortmenu(menu));
				} else {
					var menuitems = $('ul.maximenuck li', menu);
				}
				//$(document.body).append('<div id="'+opts.menuid+'-mobile" class="mobilemaximenuck"></div>');
				if (opts.container == 'body' || opts.displayeffect != 'normal') {
					$(document.body).append('<div id="' + opts.menuid + '-mobile" class="mobilemaximenuck"></div>');
				} else {
					menu.after($('<div id="' + opts.menuid + '-mobile" class="mobilemaximenuck"></div>'));
				}
				mobilemenu = $('#' + opts.menuid + '-mobile');
				mobilemenuHTML = '<div class="topbar"><span class="mobilemaximenucktitle">' + CKTEXT_PLG_MAXIMENUCK_MENU + '</span><span class="mobilemaximenuckclose"></span></div>';
				menuitems.each(function(i, itemtmp) {
					itemtmp = $(itemtmp);
					if (itemanchor = validateitem(itemtmp)
							) {
						mobilemenuHTML += '<div class="mobilemaximenuckitem">';
						// itemanchor = $('> a.maximenuck', itemtmp).length ? $('> a.maximenuck', itemtmp).clone() : $('> span.separator', itemtmp).clone();
						if (!opts.showdesc) {
							if ($('span.descck', itemanchor).length)
								$('span.descck', itemanchor).remove();
						}
						itemhref = itemanchor.attr('href') ? ' href="' + itemanchor.attr('href') + '"' : '';
						if (opts.useimages && ($('> * > img', itemtmp).length || $('> * > * > img', itemtmp).length)) {
							datatocopy = itemanchor.html();
							mobilemenuHTML += '<div class="' + itemtmp.attr('class') + '"><a ' + itemhref + '>' + datatocopy + '</a></div>';
						} else if (opts.usemodules && $('> div.maximenuck_mod', itemtmp).length) {
							datatocopy = $('> div.maximenuck_mod', itemtmp).html();
							mobilemenuHTML += '<div class="' + itemtmp.attr('class') + '">' + datatocopy + '</div>';
						} else {
							datatocopy = $('> span.titreck', itemanchor).html();
							mobilemenuHTML += '<div class="' + itemtmp.attr('class') + '"><a ' + itemhref + '>' + datatocopy + '</a></div>';
						}

						itemlevel = $(itemtmp).attr('data-level');
						j = i;
						while (menuitems[j + 1] && !validateitem(menuitems[j + 1]) && j < 1000) {
							j++;
						}
						if (menuitems[j + 1] && validateitem(menuitems[j + 1])) {
							itemleveldiff = $(menuitems[i]).attr('data-level') - $(menuitems[j + 1]).attr('data-level');
							if (itemleveldiff < 0) {
								mobilemenuHTML += '<div class="mobilemaximenucksubmenu">';
							}
							else if (itemleveldiff > 0) {
								mobilemenuHTML += '</div>';
								mobilemenuHTML += mobilemaximenu_strrepeat('</div>', itemleveldiff);
							} else {
								mobilemenuHTML += '</div>';
							}
						} else {
							mobilemenuHTML += mobilemaximenu_strrepeat('</div>', itemlevel);
						}

						if (itemtmp.hasClass('current'))
							activeitem = itemtmp.clone();
						if (!opts.showdesc) {
							if ($('span.descck', $(activeitem)).length)
								$('span.descck', $(activeitem)).remove();
						}
					} //else if ($(itemtmp).hasClass('maximenucklogo')) {
					//logoitem = $(itemtmp).clone();
					//}
				});

				mobilemenu.append(mobilemenuHTML);

				initCss(mobilemenu);

				if (activeitem) {
					if (opts.useimages) {
						activeitemtext = activeitem.find('a.maximenuck').html();
					} else {
						activeitemtext = activeitem.find('span.titreck').html();
					}
					if (!activeitemtext || activeitemtext == 'undefined')
						activeitemtext = CKTEXT_PLG_MAXIMENUCK_MENU;
				} else {
					activeitemtext = CKTEXT_PLG_MAXIMENUCK_MENU;
				}
				if ($('.maximenucklogo', menu).length && opts.showlogo) {
					logoitem = $('.maximenucklogo', menu).clone();
					$('.topbar', mobilemenu).after('<div class="' + $(logoitem).attr('class') + '">' + $(logoitem).html() + '<div style="clear:both;"></div></div>')
				}
				var position = (opts.container == 'body') ? 'absolute' : 'static';
				var mobilebutton = '<div id="' + opts.menuid + '-mobilebarmenuck" class="mobilebarmenuck" style="position:' + position + '"><span class="mobilebarmenutitleck">' + activeitemtext + '</span>'
						+ '<div class="mobilebuttonmenuck"></div>'
						+ '</div>';

				if (opts.container == 'body') {
					$(document.body).append(mobilebutton);
				} else {
					menu.after(mobilebutton);
					if (opts.displayeffect == 'normal')
						mobilemenu.css('position', 'static');
				}
				$('.mobilebuttonmenuck', $('#' + opts.menuid + '-mobilebarmenuck')).click(function() {
					openMenu();
				});
				$('.mobilemaximenuckclose', mobilemenu).click(function() {
					closeMenu();
				});
			}

			function mobilemaximenuSetAccordeon() {
				mobilemenu = $('#' + opts.menuid + '-mobile');
				$('.mobilemaximenucksubmenu', mobilemenu).hide();
				$('.mobilemaximenucksubmenu', mobilemenu).each(function(i, submenu) {
					submenu = $(submenu);
					itemparent = submenu.prev('.maximenuck');
					if ($('+ .mobilemaximenucksubmenu > div.mobilemaximenuckitem', itemparent).length)
						$(itemparent).append('<div class="mobilemaximenutogglericon" />');
				});
				$('.mobilemaximenutogglericon', mobilemenu).click(function() {
					itemparentsubmenu = $(this).parent().next('.mobilemaximenucksubmenu');
					if (itemparentsubmenu.css('display') == 'none') {
						itemparentsubmenu.css('display', 'block');
						$(this).parent().addClass('open');
					} else {
						itemparentsubmenu.css('display', 'none');
						$(this).parent().removeClass('open');
					}
				});
			}

			function updatelevel(menu) {
				$('div.maximenuck_mod', menu).each(function(i, module) {
					module = $(module);
					liparentlevel = module.parent('li.maximenuckmodule').attr('data-level');
					$('li.maximenuck', module).each(function(j, li) {
						li = $(li);
						lilevel = parseInt(li.attr('data-level')) + parseInt(liparentlevel) - 1;
						li.attr('data-level', lilevel).addClass('level' + lilevel);
					});
				});
			}

			function validateitem(itemtmp) {
				if (!itemtmp || $(itemtmp).hasClass('nomobileck'))
					return false;
//				if (($('> a.maximenuck', itemtmp).length || $('> span.separator', itemtmp).length || $('> * > a.maximenuck', itemtmp).length || $('> * > span.separator', itemtmp).length)
//							&& ($('> a.maximenuck > span.titreck', itemtmp).length || $('> span.separator > span.titreck', itemtmp).length || opts.useimages)
//							|| ($('> div.maximenuck_mod', itemtmp).length && opts.usemodules)
//							&& !itemtmp.hasClass('nomobileck')
//							)
//					if ($('> * > img', itemtmp).length && opts.useimages) {
//						return $('> *', itemtmp).clone();
				if ($('> * > img', itemtmp).length && !opts.useimages && !$('> * > span.titreck', itemtmp).length) {
					return false
				}
				if ($('> a.maximenuck', itemtmp).length)
					return $('> a.maximenuck', itemtmp).clone();
				if ($('> span.separator', itemtmp).length)
					return $('> span.separator', itemtmp).clone();
				if ($('> * > a.maximenuck', itemtmp).length)
					return $('> * > a.maximenuck', itemtmp).clone();
				if ($('> * > span.separator', itemtmp).length)
					return $('> * > span.separator', itemtmp).clone();
				if ($('> div.maximenuck_mod', itemtmp).length && opts.usemodules)
					return $('> div.maximenuck_mod', itemtmp).clone();

//					if ($('> * > * > img', itemtmp).length && opts.useimages) return $('> * > *', itemtmp).clone();
//					return $('> a.maximenuck', itemtmp).length ? $('> a.maximenuck', itemtmp).clone() : $('> span.separator', itemtmp).clone();
				return false;
			}

			function mobilemaximenu_strrepeat(string, count) {
				if (count < 1)
					return '';
				while (count > 0) {
					string += string;
					count--;
				}
				return string;
			}

			function sortmenu(menu) {
				var items = new Array();
				mainitems = $('ul.maximenuck > li.maximenuck.level1', menu);
				j = 0;
				mainitems.each(function(ii, mainitem) {
					items.push(mainitem);
					if ($(mainitem).hasClass('parent')) {
						subitemcontainer = $('.maxipushdownck > .floatck', menu).eq(j);
						subitems = $('li.maximenuck', subitemcontainer);
						subitems.each(function(k, subitem) {
							items.push(subitem);
						});
						j++;
					}
				});
				return items;
			}

			function initCss(mobilemenu) {
				switch (opts.displayeffect) {
					case 'normal':
					default:
						mobilemenu.css({
							'position': 'absolute',
							'z-index': '100000',
							'top': '0',
							'left': '0',
							'display': 'none'
						});
						break;
					case 'slideleft':
						mobilemenu.css({
							'position': 'fixed',
							'overflow': 'auto',
							'z-index': '100000',
							'top': '0',
							'left': '0',
							'width': '300px',
							'height': '100%',
							'display': 'none'
						});
						break;
					case 'slideright':
						mobilemenu.css({
							'position': 'fixed',
							'overflow': 'auto',
							'z-index': '100000',
							'top': '0',
							'right': '0',
							'left': 'auto',
							'width': '300px',
							'height': '100%',
							'display': 'none'
						});
						break;
				}
			}

			function openMenu() {
				switch (opts.displayeffect) {
					case 'normal':
					default:
						$('.mobilemaximenuck').fadeOut();
						$('#' + opts.menuid + '-mobile').fadeIn();
						if (opts.container != 'body')
							$('#' + opts.menuid + '-mobilebarmenuck').css('display', 'none');
						break;
					case 'slideleft':
						$('.mobilemaximenuck').css('display', 'block').css('opacity', '0').css('width', '0').animate({'opacity': '1', 'width': '300px'});
						$('body').css('position', 'relative').animate({'left': '300px'});
						break;
					case 'slideright':
						$('.mobilemaximenuck').css('display', 'block').css('opacity', '0').css('width', '0').animate({'opacity': '1', 'width': '300px'});
						$('body').css('position', 'relative').animate({'right': '300px'});
						break;
				}
			}

			function closeMenu() {
				switch (opts.displayeffect) {
					case 'normal':
					default:
						$('#' + opts.menuid + '-mobile').fadeOut();
						if (opts.container != 'body')
							$('#' + opts.menuid + '-mobilebarmenuck').css('display', '');
						break;
					case 'slideleft':
						$('.mobilemaximenuck').animate({'opacity': '0', 'width': '0'}, function() {
							$('.mobilemaximenuck').css('display', 'none');
						});
						$('body').animate({'left': '0'}, function() {
							$('body').css('position', '')
						});
						break;
					case 'slideright':
						$('.mobilemaximenuck').animate({'opacity': '0', 'width': '0'}, function() {
							$('.mobilemaximenuck').css('display', 'none');
						});
						$('body').animate({'right': '0'}, function() {
							$('body').css('position', '')
						});
						break;
				}
			}
		});
	}
})(jQuery);