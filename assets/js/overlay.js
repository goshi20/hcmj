/*
 * OverlayForm クラス
 *
 * フォーム系要素をオーバーレイ形式で表示するための汎用クラスです。
 * このクラスを使用する場合は、先に jQuery.js（ver 1.2.X 以上） を読み込む必要があります。
 *
 * jQuery：     http://jquery.com/
 *
 * @author      Hiroaki Wakamatsu
 * @copyright  ZYYX Inc. <http://www.zyyx.jp/>
 * @version     1.0
 *
 */


/**
 * Overlay class のコンストラクタ
 */
var Overlay = {};

(function() {

	/**
	 * 表示ブラウザがIE6か検証する
	 */
	var isIE6 = false;
	if (navigator.userAgent.match(/MSIE (\d\.\d+)/)) {
		if (RegExp.$1 == "6.0") isIE6 = true;
	}

	/**
	 * 表示ブラウザがOperaか検証する
	 */
	var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

	/**
	 * 表示領域の定義
	 */
	var winInfo = {};

	/**
	 * body 要素のマージン値
	 */
	var bodyOffset = 0;

	/*
	 * オーバーレイのスキンを定義
	 */
	var overlaySkin = {
		"tags" : "<div id='overlayScreen'></div>"
						+ "<div id='overlayContent'>"
						+ "<span id='overlayLoading'></span>"
						+ "<div id='overlayContentFrame'>"
						+ "<div id='overlayContentTitle'></div>"
						+ "<div id='overlayContentBody'></div>"
						+ "</div>"
						+ "</div>"
	};


	/*
	 * window上のスクロール量を取得する
	 */
	var getScrollPosition = function() {
		var obj = new Object();
		obj.x = document.documentElement.scrollLeft || document.body.scrollLeft;
		obj.y = document.documentElement.scrollTop || document.body.scrollTop;
		return obj;
	};


	/**
	 * オーバーレイ表示に必要な基本情報を定義する
	 *
	 * @screenFade 		背景のフェードイン処理の有無 (false ... 無し | true ... 有り)
	 * @width 					メイン要素の表示幅（デフォルト値）
	 * @height 					メイン要素の表示高（デフォルト値）
	 * @screenAlpha 		背景部分の最大アルファ値（0.0～1.0で指定： 1.0=100%となる）
	 */
	Overlay.setting = {
		"screenFade" : 		false,
		"width" : 					640,
		"height" : 					480,
		"screenAlpha" : 		0.7
	};


	/**
	 * オーバーレイ条件の定義
	 */
	Overlay.cons = {};


	/*
	 * Overlay class ： open メソッド
	 *
	 * 引数として取得した情報を元に、オーバーレイを表示する
	 * HTML上から直接関数を指定する場合に使用
	 */
	Overlay.open = function(title, type, skin, width, height) {

		$('body').css('overflow','hidden').css('height','100%')

		Overlay.cons = {
			"title" : title,
			"type" : type,
			"skin" : skin,
			"width" : !width ? Overlay.setting.width : width,
			"height" : !height ? null : height
		};

		// body 要素のマージン値を取得する
		bodyOffset = $("body").offset();

		// IE6 の場合はスクリーンを微調整する
		if (isIE6) {
			// SELECTがある場合は、表示を隠す（IEのバグ対応）
			$("select:visible").hide();

			$("#overlayScreen").css({
				"left": "-" + bodyOffset.left + "px",
				"top": "-" + bodyOffset.top + "px"
			});
		}

		// オーバーレイ用のHTMLをbody要素内に出力する
		$("body").append(overlaySkin.tags);
		Overlay.initContens();

		// 基本情報を元に背景のフェード処理を設定
		var firstOpacity = Overlay.setting.screenFade ? 0 : Overlay.setting.screenAlpha;
		var lastOpacity = Overlay.setting.screenAlpha;

		var obScreen = $("#overlayScreen");

		obScreen.css({
			"display": "block",
			"filter": "alpha(opacity=" + Math.floor(firstOpacity * 10) + ")",
			"opacity": firstOpacity
		});

		if (Overlay.setting.screenFade) {
			obScreen.fadeTo("1500", lastOpacity, function() {
			});
		}

	};

	/*
	 * Overlay class ： addCloseEvent メソッド
	 *
	 * オーバーレイを閉じるためのイベントを付加する
	 */
	Overlay.addCloseEvent = function(obj) {
		// 背景部をクリックした時の処理
		$(obj).click(function() {
			Overlay.close();
		});
	}

	/*
	 * Overlay class ： initContens メソッド
	 *
	 * 対象に応じて、メイン用の表示制御を行う
	 */
	Overlay.initContens = function(cons) {

		// タイトルの指定
		$("#overlayContentTitle").html(Overlay.cons.title);

		if (Overlay.cons.type == "script") {

			// 中身のHTMLをセットする
			$("#overlayContentBody").html(Overlay.skin[Overlay.cons.skin]);
			if (Overlay.cons.height) {
				$("#overlayContentBody").css("height", Overlay.cons.height + "px");
			}

			// 指定されたイベントを読み込む
			eval(Overlay.cons.fnc);

			// オーバーレイ内部の「閉じる」ボタンにイベントを付加
			Overlay.addCloseEvent("#overlayCloseBtn");
		}else if (Overlay.cons.type == "htmltag") {

			// 中身のHTMLをセットする
			$("#overlayContentBody").html(Overlay.cons.skin);
			if (Overlay.cons.height) {
				$("#overlayContentBody").css("height", Overlay.cons.height + "px");
			}

			// 指定されたイベントを読み込む
			eval(Overlay.cons.fnc);

			// オーバーレイ内部の「閉じる」ボタンにイベントを付加
			Overlay.addCloseEvent("#overlayCloseBtn");
		} else {
			var sabunH = Math.floor(((Overlay.cons.height) ? Overlay.cons.height : Overlay.setting.height) - $("#overlayContentTitle").height());
			$("#overlayContentBody").css("height", sabunH + "px").html("<iframe id='overlayIFrame' src='" + Overlay.cons.skin + "' width='" + Overlay.cons.width + "' height='" + sabunH + "' border='0' frameborder='0' scrolling=''></iframe>");
		}

		// オーバーレイ上部の「閉じる」アイコンにイベントを付加
		Overlay.addCloseEvent("#overlayCloseIcon");

		var obContent = $("#overlayContentFrame");
		obContent.css({
			"width": Overlay.cons.width + "px"
		});

		// メイン領域のサイズ・表示位置の調整
		Overlay.resetFrameSize();
		Overlay.setCenter();

		obContent.css({
			"visibility": "visible",
			"filter": "alpha(opacity=0)",
			"opacity": "0.0"
		}).fadeTo("first", 1.0, function() {
		});

		// コンテンツ枠の背景を初期化する
		$("#overlayContent").css("background", "none");
		$("#overlayLoading").remove();
	};

	/*
	 * Overlay class ： resetFrameSize メソッド
	 *
	 * オーバーレイ内のメイン領域を初期状態に戻す
	 */
	Overlay.resetFrameSize = function() {
		$("#overlayContent").css({
			"visibility": "visible",
			"width": Overlay.cons.width + "px",
			"height": $("#overlayContentFrame").height() + "px"
		});
	};


	/*
	 * Overlay class ： close メソッド
	 *
	 * オーバーレイを閉じる
	 */
	Overlay.close = function() {
		$("#overlayContentFrame").empty();
		$("#overlayContent").remove();
		Overlay.removeScreen();
		$('body').css('overflow-y','scroll').css('height','auto')
	};


	/*
	 * Overlay class ： removeScreen メソッド
	 *
	 * 背景要素を画面上から取り除く
	 */
	Overlay.removeScreen = function(obj) {
		// 背景をフェードアウトする
		var obScreen = $("#overlayScreen:visible");

		if (Overlay.setting.screenFade) {
			obScreen.fadeTo("first", 0, function() {
				Overlay.initScreen();
				$(this).remove();
			});
		} else {
			Overlay.initScreen();
			obScreen.remove();
		}
	}


	/*
	 * Overlay class ： initScreen メソッド
	 *
	 * スクリーンの状態を元に戻す（IE6限定）
	 */
	Overlay.initScreen = function(obj) {
		if (isIE6) {
			// SELECTの表示を有効にする
			$("select:hidden").show();
		}
	}


	/*
	 * Overlay class ： setCenter メソッド
	 *
	 * 指定された要素を画面中央に表示する
	 */
	Overlay.setCenter = function() {
		var obContent = $("#overlayContent");
		var width = obContent.width();
		var height = obContent.height();

		var addLeft = 0;
		var addTop = 0;

		if (isIE6) {
			var screenPos = getScrollPosition();
			addLeft = screenPos.x - bodyOffset.left;
			addTop = screenPos.y - bodyOffset.top;
		}

		// ウインドウの表示領域を取得する(Operaだけちょっと取得値がおかしい・・・)
		winInfo = {
			"outerW" : $(document).width(),
			"outerH" : $(document).height(),
			"innerW" : $(window).width(),
			"innerH" : $(window).height()
		};

		obContent.css({
			"left" : (Math.floor((winInfo.innerW - width) / 2) + addLeft) + "px",
			"top" : (Math.floor((winInfo.innerH - height) / 2) + addTop) + "px"
		});
	};


	/*
	 * Overlay class ： reloadParent メソッド
	 *
	 * オーバーレイの呼び出し元となるページをリロードする
	 */
	Overlay.reloadParent = function() {
		location.reload();
	};

})();


/**
 * ページ読み込み時の処理
 */
$(function() {
	//overlayEvent();

	// ウインドウがリサイズした時の処理を付加
	$(window).resize(function() {
		// オーバーレイが表示されている時は、メイン要素を画面中央に寄せる
		if ($("#overlayContent:visible").get(0)) {
			Overlay.setCenter();
		}
	});
});

