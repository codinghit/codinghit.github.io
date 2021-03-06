$(function () {
    /**
     * 添加文章卡片hover效果.
     */
    let articleCardHover = function () {
        let animateClass = 'animated pulse';
        $('article .article').hover(function () {
            $(this).addClass(animateClass);
        }, function () {
            $(this).removeClass(animateClass);
        });
    };
    articleCardHover();

    /*菜单切换*/
    $('.sidenav').sidenav();

    /* 修复文章卡片 div 的宽度. */
    let fixPostCardWidth = function (srcId, targetId) {
        let srcDiv = $('#' + srcId);
        if (srcDiv.length === 0) {
            return;
        }

        let w = srcDiv.width();
        if (w >= 450) {
            w = w + 21;
        } else if (w >= 350 && w < 450) {
            w = w + 18;
        } else if (w >= 300 && w < 350) {
            w = w + 16;
        } else {
            w = w + 14;
        }
        $('#' + targetId).width(w);
    };

    /**
     * 修复footer部分的位置，使得在内容比较少时，footer也会在底部.
     */
    let fixFooterPosition = function () {
        $('.content').css('min-height', window.innerHeight - 165);
    };

    /**
     * 修复样式.
     */
    let fixStyles = function () {
        fixPostCardWidth('navContainer');
        fixPostCardWidth('artDetail', 'prenext-posts');
        fixFooterPosition();
    };
    fixStyles();

    /*调整屏幕宽度时重新设置文章列的宽度，修复小间距问题*/
    $(window).resize(function () {
        fixStyles();
    });

    /*初始化瀑布流布局*/
    $('#articles').masonry({
        itemSelector: '.article'
    });

    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 700,
        delay: 100
    });

    /*文章内容详情的一些初始化特性*/
    let articleInit = function () {
        $('#articleContent a').attr('target', '_blank');

        $('#articleContent img').each(function () {
            let imgPath = $(this).attr('src');
            $(this).wrap('<div class="img-item" data-src="' + imgPath + '" data-sub-html=".caption"></div>');
            // 图片添加阴影
            $(this).addClass("img-shadow img-margin");
            // 图片添加字幕
            let alt = $(this).attr('alt');
            let title = $(this).attr('title');
            let captionText = "";
            // 如果alt为空，title来替
            if (alt === undefined || alt === "") {
                if (title !== undefined && title !== "") {
                    captionText = title;
                }
            } else {
                captionText = alt;
            }
            // 字幕不空，添加之
            if (captionText !== "") {
                let captionDiv = document.createElement('div');
                captionDiv.className = 'caption';
                let captionEle = document.createElement('b');
                captionEle.className = 'center-caption';
                captionEle.innerText = captionText;
                captionDiv.appendChild(captionEle);
                this.insertAdjacentElement('afterend', captionDiv)
            }
        });
        $('#articleContent, #myGallery').lightGallery({
            selector: '.img-item',
            // 启用字幕
            subHtmlSelectorRelative: true
        });

        // progress bar init
        const progressElement = window.document.querySelector('.progress-bar');
        if (progressElement) {
            new ScrollProgress((x, y) => {
                progressElement.style.width = y * 100 + '%';
            });
        }
    };
    articleInit();

    $('.modal').modal();

    /*回到顶部*/
    $('#backTop').click(function () {
        $('body,html').animate({ scrollTop: 0 }, 400);
        $nav.addClass('nav-transparent');
        $nav_menu.slideDown(400);
        $brand_logo.slideDown(400);
        return false;
    });

    /*监听滚动条位置*/
    let $nav = $('#headNav');
    let $backTop = $('.top-scroll');
    let $nav_menu = $('.nav-menu');
    let $brand_logo = $('.brand-logo');
    // let $mobile_nav = $('#mobile_nav')
    // 当页面处于文章中部的时候刷新页面，因为此时无滚动，所以需要判断位置,给导航加上绿色。
    showNav($(window).scrollTop());


    function computerShowOrHideNavBg(position) {
        let showPosition = 100;
        if (position < showPosition) {
            // $nav.addClass('nav-transparent');
            $backTop.slideUp(300);
        } else {
            // $nav.removeClass('nav-transparent');
            $backTop.slideDown(300);
        }
    }

    function showNav(position) {
        let showPosition = 100;
        if (position < showPosition) {
            $nav.addClass('nav-transparent');
        } else {
            $nav.removeClass('nav-transparent');
        }
    }


    //判断是手机端还是pc端
    // console.log(navigator.userAgent);
    var os = function () {
        var ua = navigator.userAgent,
            isWindowsPhone = /(?:Windows Phone)/.test(ua),
            isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
            isAndroid = /(?:Android)/.test(ua),
            isFireFox = /(?:Firefox)/.test(ua),
            isChrome = /(?:Chrome|CriOS)/.test(ua),
            isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
            isPhone = /(?:iPhone)/.test(ua) && !isTablet,
            isPc = !isPhone && !isAndroid && !isSymbian;
        return {
            isTablet: isTablet,
            isPhone: isPhone,
            isAndroid: isAndroid,
            isPc: isPc
        };
    }();

    function phoneShowOrHideNavBg(position) {
        let showPosition = 100;
        if (position < showPosition) {
            $nav.addClass('nav-transparent');
            $backTop.slideUp(300);
        } else {
            $nav.removeClass('nav-transparent');
            $backTop.slideDown(300);
        }
    }

    if (os.isAndroid || os.isPhone) {
        // alert("手机")
        $(window).scroll(function () {
            /* 回到顶部按钮根据滚动条的位置的显示和隐藏.*/
            let scroll = $(window).scrollTop();
            phoneShowOrHideNavBg(scroll);
        });
    } else if (os.isTablet) {
        //alert("平板")
    } else if (os.isPc) {
        //alert("电脑")
        $(window).scroll(function () {
            /* 回到顶部按钮根据滚动条的位置的显示和隐藏.*/
            let scroll = $(window).scrollTop();
            computerShowOrHideNavBg(scroll);
        });
        //  自定义函数
        var scrollFunc = function (e) {
            e = e || window.event;
            if (e.wheelDelta) { //第一步：先判断浏览器IE，谷歌滑轮事件    
                if (e.wheelDelta > 0) { //当滑轮向上滚动时 
                    //   console.log("滑轮向上滚动"); 
                    if ($(window).scrollTop() < 130) {
                        $nav.addClass('nav-transparent');
                    } else {
                        $nav.removeClass('nav-transparent');
                        $nav_menu.slideDown(0);
                        $brand_logo.slideDown(0);
                    }
                }
                if (e.wheelDelta < 0) { //当滑轮向下滚动时 
                    //   console.log("滑轮向下滚动");
                    if ($(window).scrollTop() < 130) {
                        $nav.addClass('nav-transparent');
                    } else {
                        $nav.addClass('nav-transparent');
                        $nav_menu.slideUp(0);
                        $brand_logo.slideUp(0);
                    }
                }
            } else if (e.detail) { //Firefox滑轮事件 
                if (e.detail > 0) { //当滑轮向上滚动时 
                    //   console.log("滑轮向上滚动");
                    if ($(window).scrollTop() < 130) {
                        $nav.addClass('nav-transparent');
                    } else {
                        $nav.removeClass('nav-transparent');
                        $nav_menu.slideDown(0);
                        $brand_logo.slideDown(0);
                    }
                }
                if (e.detail < 0) { //当滑轮向下滚动时 
                    //   console.log("滑轮向下滚动"); 
                    if ($(window).scrollTop() < 130) {
                        $nav.addClass('nav-transparent');
                    } else {
                        $nav.addClass('nav-transparent');
                        $nav_menu.slideUp(0);
                        $brand_logo.slideUp(0);
                    }
                }
            }
        }
        //给页面绑定滑轮滚动事件 
        if (document.addEventListener) {//firefox 
            document.addEventListener('DOMMouseScroll', scrollFunc, false);
        }
        //滚动滑轮触发scrollFunc方法 //ie 谷歌 
        window.onmousewheel = document.onmousewheel = scrollFunc;
    }




    $(".nav-menu>li").hover(function () {
        $(this).children('ul').stop(true, true).show();
        $(this).addClass('nav-show').siblings('li').removeClass('nav-show');

    }, function () {
        $(this).children('ul').stop(true, true).hide();
        $('.nav-item.nav-show').removeClass('nav-show');
    })

    $('.m-nav-item>a').on('click', function () {
        if ($(this).next('ul').css('display') == "none") {
            $('.m-nav-item').children('ul').slideUp(300);
            $(this).next('ul').slideDown(100);
            $(this).parent('li').addClass('m-nav-show').siblings('li').removeClass('m-nav-show');
        } else {
            $(this).next('ul').slideUp(100);
            $('.m-nav-item.m-nav-show').removeClass('m-nav-show');
        }
    });
});
