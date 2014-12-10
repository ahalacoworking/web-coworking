(function($) {
    'use strict'
    $(document).ready(function() {
        var equalheight = function(container) {
            var currentTallest = 0,
                currentRowStart = 0,
                rowDivs = [],
                $el;
            $(container).each(function() {
                $el = $(this);
                $($el).height('auto')
                var topPosition = $el.position().top;
                var currentDiv;
                if (currentRowStart !== topPosition) {
                    for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                        rowDivs[currentDiv].height(currentTallest);
                    }
                    rowDivs.length = 0; // empty the array
                    currentRowStart = topPosition;
                    currentTallest = $el.height();
                    rowDivs.push($el);
                } else {
                    rowDivs.push($el);
                    currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
                }
                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                    rowDivs[currentDiv].height(currentTallest);
                }
            });
        }

        $(window).load(function() {
            equalheight('.same-height');
        });

        if ($(window).width() > 1500) {
            $('.effect-wrapper').addClass('col-lg-3');
        }
        if ($(window).width() < 768) {
            $('.animated').removeClass('animated').removeClass('hiding');
            $('.stat span').removeClass('timer');
            $('.timeslot-label').addClass('stick-label');
        }
        if ($(window).height() < 512) {
            $('#bottom-navlinks').removeClass('bottom-navlinks').addClass('bottom-navlinks-small');
        }
        if ($(window).scrollTop() >= 100) {
            $('#top-header').addClass('after-scroll');
            $('#logo-header .logo').removeClass('logo-light').addClass('logo-dark');
        }

        $(window).scroll(function() {
            var scroll = $(this).scrollTop();
            var header = $('#top-header');
            var logo = $('#logo-header .logo');
            var topOffset = header.height() + $('.track-header').height();

            if (scroll >= 100) {
                header.addClass('after-scroll');
                logo.removeClass('logo-light').addClass('logo-dark');
            } else {
                header.removeClass('after-scroll');
                logo.removeClass('logo-dark').addClass('logo-light');
            }

            $('.slot').each(function() {
                var currentPosition = $(this).offset().top - scroll;
                var offsetActivator = topOffset + $(this).find('.slot-title').height();
                if (currentPosition <= offsetActivator && currentPosition >= 0) {
                    $('.track-header.sticky').find('.slot-detail').html($(this).data('slotDetail'));
                }
            });
        });

        $(function() {
            $('a[href*=#]:not([href=#])').click(function() {
                if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, 1000);
                        return false;
                    }
                }
            });
        });
        $(function() {
            $('a[href=#]').click(function() {
                event.preventDefault();
            });
        });

        $(function() {
            var delay, i, offset, _i, _len, _ref;
            _ref = $(".appear-animation");
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                i = _ref[_i];
                offset = i.offsetLeft + i.offsetTop;
                delay = offset / 1000;
                $(i).css('transition-delay', '' + (delay * 0.47) + 's');
                $(i).css('transition-duration', '' + 0.2 + 's');
            }
        });
        $('.appear-animation-trigger').appear(function() {
            setTimeout(function() {
                $('.appear-animation-trigger').parent('div').find('.appear-animation').addClass('visible');
            }, 1000);
        });

        $('.animated').appear(function() {
            var element = $(this);
            var animation = element.data('animation');
            var animationDelay = element.data('delay');
            if (animationDelay) {
                setTimeout(function() {
                    element.addClass(animation + " visible");
                    element.removeClass('hiding');
                    if (element.hasClass('counter')) {
                        element.find('.timer').countTo();
                    }
                }, animationDelay);
            } else {
                element.addClass(animation + " visible");
                element.removeClass('hiding');
                if (element.hasClass('counter')) {
                    element.find('.timer').countTo();
                }
            }
        }, {
            accY: -150
        });

    });

    // Google maps static
    if (typeof staticGoogleMaps !== 'undefined') {
        $('#canvas-map').addClass('image-section').css('background-image','url(http://maps.googleapis.com/maps/api/staticmap?zoom=17&center=' + mobileCenterMapCoordinates +'&size=' + $(window).width() + 'x700&scale=2&language=en&markers=icon:' + icon +'|'+ eventPlaceCoordinates +'&maptype=roadmap&style=visibility:on|lightness:40|gamma:1.1|weight:0.9&style=element:labels|visibility:off&style=feature:water|hue:0x0066ff&style=feature:road|visibility:on&style=feature:road|element:labels|saturation:-30)');
    }

    //Google maps
    if (googleMaps) {
        var map;
        var markers = [];
        var MY_MAPTYPE_ID = 'custom_style';

        var initialize = function() {

            var zoomedOpts = [{
                stylers: [{
                    lightness: 40
                }, {
                    visibility: 'on'
                }, {
                    gamma: 1.1
                }, {
                    weight: 0.9
                }]
            }, {
                elementType: 'labels',
                stylers: [{
                    visibility: 'off'
                }]
            }, {
                featureType: 'water',
                stylers: [{
                    color: '#5dc7ff'
                }]
            }, {
                featureType: 'road',
                stylers: [{
                    visibility: 'on'
                }]
            }, {
                featureType: 'road',
                elementType: "labels",
                stylers: [{
                    saturation: -30
                }]
            }];

            var mapOptions = {
                zoom: 17,
                minZoom: 2,
                scrollwheel: false,
                panControl: false,
                draggable: true,
                zoomControl: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                scaleControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                center: centerMap,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
                },
                mapTypeId: MY_MAPTYPE_ID
            };
            if ($(window).width() < 768) {
                mapOptions.center = mobileCenterMap;
            }

            map = new google.maps.Map(document.getElementById('canvas-map'), mapOptions);
            var marker = new google.maps.Marker({
                position: eventPlace,
                animation: google.maps.Animation.DROP,
                icon: icon,
                map: map
            });
            markers.push(marker);
            var zoomedMapOptions = {
                name: 'Zoomed Style'
            };
            var zoomedMapType = new google.maps.StyledMapType(zoomedOpts, zoomedMapOptions);
            map.mapTypes.set('zoomed', zoomedMapType);
            map.setMapTypeId('zoomed');

        }

        google.maps.event.addDomListener(window, 'load', initialize);
    }

})(jQuery);
