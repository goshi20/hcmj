/********************************************
*****ページトップへスクロールします
*********************************************/

$(function() {
	var topBtn = $('#page_top_link a');
	topBtn.hide();
	//スクロールが100に達したらボタン表示
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			topBtn.fadeIn();
		} else {
			topBtn.fadeOut();
		}
	});
	//スクロールしてトップ
	topBtn.click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 500);
		return false;
	});
})

/********************************************
*****配信先によってチェックボックスの活性・非活性を切り替えます
********************************************/
function check_input(){
	if($("#all").prop('checked')){
		$('.group_select input').attr('disabled','disabled');
		$('.group_select table td').css('color','#999999');
	}
	else{
		$('.group_select input').removeAttr('disabled');
		$('.group_select table td').css('color','#333333');
	}
}

/********************************************
*****オーバーレイを表示します
*********************************************/
$(function() {
	$(".overlay_ajax").colorbox({
		width:"750px",
		height:"530px",
		opacity: 0.7,
		transition:"fade",
		overlayClose:false,
		escKey:false,
		fixed:true,
		iframe:true,
		onOpen:function(){
			$('body').css('overflow','hidden').css('height','100%');
			$('#cboxOverlay').on('touchmove.noScroll', function(e) {
				e.preventDefault();
			});
		},
		onComplete:function(){
			try{
				//D-1からのオーバーレイ表示の場合チェックボックス操作の処理
				window.onload=function(){
					check_input();
				}
			}
			catch(e){
				//D-1からのオーバーレイ以外の場合例外処理
			}
		},
		onClosed:function(){
			$('body').css('overflow','auto').css('height','auto')
			$('#cboxOverlay').off('.noScroll');
		}
	});
});

/********************************************
*****ツールチップを表示します
*********************************************/
$(function() {
	$(".info-wrapper")
    .mouseover(function(e) {
      $(this).addClass("is-active");
    })
    .mouseout(function(e) {
			$(this).removeClass("is-active");
    });

});
