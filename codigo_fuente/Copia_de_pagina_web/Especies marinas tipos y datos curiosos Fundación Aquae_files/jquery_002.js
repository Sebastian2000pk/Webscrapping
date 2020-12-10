(function($) {
	$.fn.twClick = function (click) {
		this.bind("mousedown", function (e) {
			click.call(this, e);
		});
		return this;
	};

	$.fn.extend({
		shufflepuzzle: function(options) {
			var defaults = {
				img_puzzle: 'img/puzzle.jpg',
				width: 400,
				height: 400,
				showStart: true,
				tilesH: 4,
				tilesV: 4,
				gap: true,
				auto_size: false,
				duration: 100,
				bgColor: '#fff',
				bgOpacity: 1,
				imgBgOpacity: .2,
				shuffleNum: 5,
				menuVisible: true,
                mixed: true,
                numbering: false,
				menuNameShuffle: 'Shuffle',
				menuNameGrid: 'Grid',
				menuNameImage: null,
				menu_shuffle:{
					Easy: 10,
					Medium: 30,
					Hard: 60
				},
				menu_grid: ['3x3', '4x4', '5x5'],
				onStart : null,
				onChange : null,
				afterCreate : null,
				onCompleted : null,
				firstStart : false,
				stop : false
			};

			var rand = Math.round(Math.random() * 99999);
			var _Completed = false;
            var _duration = defaults.duration;

			return this.each(function() {

                $.fn.shufflepuzzle[$(this).attr("class")] = function (opt) {
                    $('.img_title' + rand).remove();
                    o = $.extend(o, opt);
                    loading_vis(1);
                };

                var o = $.extend(defaults, options),
                    tiles = [],
                    tilesShuffle = [],
                    grid = [],
                    sum = o.tilesV * o.tilesH,
                    lineWidth = o.gap ? 1 : 0,
                    i = 0,
                    nu = 0,
                    ii = false,
                    cl = sum - 1,
                    cl1 = -1,
                    cl2 = cl,
                    i_w = 0,
                    i_h = 0,
                    obj = $(this),
                    m_shuffle = '',
                    m_grid = '',
                    m_img = '',
                    ratio = 1,
                    mixed = o.mixed,
                    _firstStart = o.firstStart,
                    duration_ = o.duration,
                    vs_h, vs_v;

                _duration = o.duration;

                if (!o.showStart) {
                    o.duration = 1;
                }

                ratio = o.width / o.height;

                var img = new Image();
                img.onload = function () {
                    StartPuzzle();
                };

                var k = Object.keys(o.menu_image)[0];
                o.img_puzzle = !!k ? o.menu_image[k] : o.img_puzzle;
				img.src = o.img_puzzle;

				function loading_vis (a) {
					if (!o.showStart) {
						o.duration = 1;
					}
					if (a) {
						$('#imgbg' + rand).attr('src', o.img_puzzle);
					}

					_create();
				}
				
				function StartPuzzle() {
					for (var key in o.menu_shuffle) {
						m_shuffle += '<li>'+key+'</li>';
					}
					
					for (var i = 0; i < o.menu_grid.length; i++) {
						m_grid += '<li>'+o.menu_grid[i]+'</li>';
					}

                    for (key in o.menu_image) {
                        m_img += '<li><span>' + key + '<img alt="' + key+'" src="' + o.menu_image[key] + '"></span></li>';
                    }

					var mNS ='';
					var mNG='';
					var mNI='';

					if (o.menuNameShuffle) {
						mNS = '<li>'+o.menuNameShuffle+'<ul class="pz_shuffle' + rand + '">'+m_shuffle+'</ul></li>';
					}

					if (o.menuNameGrid) {
						mNG = '<li>'+o.menuNameGrid+'<ul class="pz_grid' + rand + '">'+m_grid+'</ul></li>';
					}

					if (o.menuNameImage) {
						mNI = '<li>'+o.menuNameImage+'<ul class="pz_img' + rand + '">'+m_img+'</ul></li>';
					}

					$(obj).width(o.width).height(o.height);
					$(obj).prepend('<div class="sp_bg visible" id="bg' + rand + '"><img class="imgbg" id="imgbg' + rand + '" width="' + o.width + '" height="' + o.height + '" src="' + o.img_puzzle + '" draggable="false"/></div>');
					$(obj).addClass("sh_puzzle");

					$('#imgbg' + rand).css({
						"transition": "opacity "+duration_+"ms ease-out"
					});

					if (o.menuVisible) {
						$(obj).prepend('<div class="spmenu" id="menu' + rand + '">'+
							'<ul id="puzzle-navigation">' + mNS + mNG + mNI + '</ul>'+
						'</div>');
					}

					$('ul.pz_shuffle' + rand + ' li').twClick(function(e) {
						if (e.button !== 2) {
							$('.img_title' + rand).remove();
							o.shuffleNum = o.menu_shuffle[$(this).text()];
							loading_vis();
						}
					});

					$('ul.pz_grid' + rand + ' li').twClick(function(e) {
						if (e.button !== 2) {
							$('.img_title' + rand).remove();
							grid = $(this).text().replace(/[^A-Za-z0-9#:;-]/g,'').split('x');
							o.tilesV = parseInt(grid[0]);
							o.tilesH = parseInt(grid[1]);
							sum = o.tilesV*o.tilesH;
							loading_vis();
						}
					});

					$('ul.pz_img' + rand + ' li').twClick(function(e) {
						if (e.button !== 2 && o.img_puzzle != o.menu_image[$(this).text()]) {
							$('.img_title' + rand).remove();
							var ss = o.menu_image[$(this).text()];
							img.src = o.img_puzzle = ss;
							img.onload = function() {
								loading_vis(1);
							}
						}
					});

					$('#bg' + rand).css({
						'background-color': o.bgColor,
						'opacity': o.bgOpacity
					});

					$('#menu' + rand).css({
						'color': 'white',
						'position': 'absolute',
						'z-index': 99
					});

					if (_firstStart) {
						o.firstStart();
						_firstStart = false;
					}
					if (!o.stop) {
                        _create();
					}

					sp_rezize();
					$(window).resize(function() {
						sp_rezize();
					});
				}

				function bg_show() {
					$('#bg' + rand).removeClass('visible').css({
						'background-color': o.bgColor,
						'opacity': o.bgOpacity
					});
				}
				
				function _create() {
                    if (!o.showStart) {
                    	o.duration = 1;
                    }

                    vs_h = Math.floor((o.width - (Math.floor(o.width/o.tilesH)*o.tilesH))/2);
					vs_v = Math.floor((o.height - (Math.floor(o.height/o.tilesV)*o.tilesV))/2);

					ii = false;
					cl = sum-1;
					cl1 = -1;
					cl2 = cl;

					_Completed=false;

					tiles = [];
					tilesShuffle = [];

					if (o.showStart) {
						bg_show();
						$('#imgbg' + rand).css({
							'opacity': o.imgBgOpacity
						});
					}

					for (i_h=0; i_h<sum; i_h++) {
						tiles.push(i_h);
						tilesShuffle.push(i_h);				
					}
					
					i=0;
					var numb_el='';
					for (i_h=0; i_h<o.tilesV; i_h++) {
						for (i_w=0; i_w<o.tilesH; i_w++) {

							if (o.numbering) {
                                numb_el = '<span class="numbering">' + (i+1) + '</span>';
							}
							$(obj).prepend('<div class="anim img_title' + rand+'" id="img_num' + i + rand + '">' + numb_el + '<img id="imgb' + i + rand +'" width="'+o.width+'" height="'+o.height+'" src="'+o.img_puzzle+'" draggable="false"></div>');
							$('#imgb' + i + rand).css({
								'margin-top': '-'+(vs_v+i_h*Math.floor(o.height/o.tilesV))+'px',
								'margin-left': '-'+(vs_h+i_w*Math.floor(o.width/o.tilesH))+'px',
								'max-width': 'none'
							});
							
							$('#img_num' + i + rand).css({
								'width': Math.floor(o.width/o.tilesH)-lineWidth + 'px',
								'height': Math.floor(o.height/o.tilesV)-lineWidth + 'px',
								'position': 'absolute',
								'overflow': 'hidden',
								'left': vs_h+i_w*Math.floor(o.width/o.tilesH) + 'px',
								'top': vs_v+i_h*Math.floor(o.height/o.tilesV) + 'px',
								'z-index': 1
							}).data({
								'name': tiles[i],
								'etalon': tiles[i]
							}).twClick(function(e) {
								if (_Completed) {
									return false;
								}

								if (e.button !== 2) {
									if (($(this).data().name+1 == cl && cl % o.tilesH != 0) || ($(this).data().name-1 == cl && cl % o.tilesH != o.tilesH-1)) {
										cl2 = $(this).data().name;
										$(this).data('name', cl).css({
											'left': vs_h+(cl%o.tilesH * Math.floor(o.width/o.tilesH))
										});
										cl = cl2;

										if (mixed) {
                                            _checkTile($(this));
										}

										if (o.onChange) {
											o.onChange();
										}
									} else if ($(this).data().name+o.tilesH == cl || $(this).data().name-o.tilesH == cl) {
										cl2 = $(this).data().name;
										$(this).data('name', cl).css({
											'top': vs_v+(Math.floor(cl/o.tilesH) * Math.floor(o.height/o.tilesV))
										});
										cl = cl2;

                                        if (mixed) {
                                            _checkTile($(this));
                                        }

										if (o.onChange) {
											o.onChange();
										}
									}
									
									if (_sort()) {
										$('#imgbg' + rand).css('opacity', 1);
										$('#bg' + rand).addClass('visible');

										if (o.onCompleted) {
											_Completed = true;
											setTimeout(function() {o.onCompleted()}, o.duration+50)
										}
									}
								}
							});
							i++;
							if (i === sum-1) {
								i_w = o.tilesH;
							}
						}
					}

                    function _checkTile(data) {
						if (data.data().name === data.data().etalon) {
                            data.removeClass('mixed');
						} else {
                            data.addClass('mixed');
						}
					}

					if (o.showStart) {
						$(".sh_puzzle > .anim").css({
							"transition": "all " + o.duration + "ms ease-out 0s"
						});
					} else {
						$(".sh_puzzle > .anim").css({
							"opacity": 0
						});
					}
					cl = tiles[tiles[sum-1]];
					var m_rand=0;
					i=0;

					if (o.shuffleNum !== 0) {
						setTimeout(Step, 100);
					} else {
						return false;
					}
					function Step() {
						m_rand = Math.round(Math.random()*(sum-2));
						var parm_n = $('#img_num' + m_rand + rand).data().name;
						ii = false;
						while(!ii) {
							if (cl1 != parm_n) {
								if ( (parm_n+1 == cl && cl % o.tilesH != 0) || (parm_n-1 == cl && cl % o.tilesH != o.tilesH-1) ) {
									cl2 = parm_n;
									cl1 = cl;
									$('#img_num' + m_rand + rand).data('name', cl)
									.css({
										'left': vs_h+(cl%o.tilesH * Math.floor(o.width/o.tilesH))
									});
									_comp($('#img_num' + m_rand + rand).data('name', cl));
									cl = cl2;
									ii = true;
								} else if (parm_n+o.tilesH == cl || parm_n-o.tilesH == cl) {
									cl2 = parm_n;
									cl1 = cl;
									$('#img_num' + m_rand + rand).data('name', cl)
									.css({
										'top': vs_v+(Math.floor(cl/o.tilesH) * Math.floor(o.height/o.tilesV))
									});
                                    _comp($('#img_num' + m_rand + rand).data('name', cl));
									cl = cl2;
									ii = true;
								}
							}
							m_rand = Math.round(Math.random()*(sum-2));
							parm_n = $('#img_num' + m_rand + rand).data().name;
						}
						i++;
					}

					function _comp(el) {
						if (mixed) {
                            el.addClass('mixed');
                        }

						if (i<o.shuffleNum-1) {
							setTimeout(Step, o.duration/5);
						} else {
							if (!o.showStart) {
								$(".sh_puzzle > .anim").css({
                                    "transition": "all " + o.duration + "ms ease-out 0s"
                                });

								$('#imgbg' + rand).css({
									'opacity': o.imgBgOpacity
								});
										
								setTimeout(function () {
									o.duration = duration_;
									$(".sh_puzzle > .anim").css("opacity", 1);
								}, duration_);
							}

                            o.duration = _duration;
                            $(".sh_puzzle > .anim").css({
                                "transition": "all " + o.duration + "ms ease-out 0s"
                            });
							if (o.afterCreate) {
								o.afterCreate();
							}

							if (!o.showStart) {
								bg_show();
							}
						}
					}

                    function _sort() {
						for (i_h = 0; i_h < sum-1; i_h++) {
							if ($('#img_num' + i_h + rand).data().etalon == $('#img_num' + i_h + rand).data().name == false) {
                                if (mixed) {
                                    $('#img_num' + i_h + rand).addClass('mixed');
								}
								return false;
							}
						}
						return true;
					}

					sp_rezize();

					if (o.onStart) {
						o.onStart();
					}
				}

				function sp_rezize() {
					if (o.auto_size) {
						o.width = $(obj).parent().width();
						o.height = o.width/ratio;
					}
					$(obj).width(o.width).height(o.height);
					$('#imgbg' + rand).width(o.width).height(o.height);

					vs_h = Math.floor((o.width - (Math.floor(o.width/o.tilesH)*o.tilesH))/2);
					vs_v = Math.floor((o.height - (Math.floor(o.height/o.tilesV)*o.tilesV))/2);
					nu=0;
					for (i_h=0; i_h<o.tilesV; i_h++) {
						for (i_w=0; i_w<o.tilesH; i_w++) {
							$('#imgb' + nu + rand).css({
								width: o.width,
								height: o.height,
								'margin-top': -(vs_v+i_h*Math.floor(o.height/o.tilesV)),
								'margin-left': -(vs_h+i_w*Math.floor(o.width/o.tilesH))
							});


							$('#img_num' + nu + rand).css({
								'width': Math.floor(o.width/o.tilesH)-lineWidth,
								'height': Math.floor(o.height/o.tilesV)-lineWidth,
								'left': vs_h+($('#img_num' + nu + rand).data('name')%o.tilesH * Math.floor(o.width/o.tilesH)),
								'top': vs_v+(Math.floor($('#img_num' + nu + rand).data('name')/o.tilesH) * Math.floor(o.height/o.tilesV))
							});
							nu++;
						}
					}
				}
			});
		}
	});
})(jQuery);