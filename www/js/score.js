
document.addEventListener('DOMContentLoaded', function(){
    const rateForms = document.querySelectorAll('.rating'); /* 별점 선택 템플릿을 모두 선택 */
	rateForms.forEach(function(item){//클릭 이벤트 리스너 각각 등록
		item.addEventListener('click',function(e){
			let elem = e.target;
			if(elem.classList.contains('rate_radio')){
				rating.setRate(elem.parentElement, parseInt(elem.value)); // setRate() 에 ".rating" 요소를 첫 번째 파라메터로 넘김
			}
		})
	});

    document.querySelector('.review_textarea').addEventListener('keydown',function(){
        let review = document.querySelector('.review_textarea');
        let lengthCheckEx = /^.{400,}$/;
        if(lengthCheckEx.test(review.value)){
            review.value = review.value.substr(0,400);
        }
    });
    document.querySelector('#save').addEventListener('click', function(e){
        if(rating.rate == 0){
            rating.showMessage('rate');
            return false;
        }
        if(document.querySelector('.review_textarea').value.length < 5){
            rating.showMessage('review');
            return false;
        }
		alert("저장완료!");
		rating.setRate(null, 0);
		document.querySelector('.review_textarea').value = '';
    });
});

function Rating(){};
Rating.prototype.rate = 0;
Rating.prototype.setRate = function(rateobj, newrate){
    this.rate = newrate;
	let checks = null;
	if(rateobj){
		rateobj.querySelector('.ratefill').style.width = parseInt(newrate * 60) + 'px';
		checks = rateobj.querySelectorAll('.rate_radio');
	}else{
		const rateFills = document.querySelectorAll('.ratefill');
		rateFills.forEach(function(item){
			item.style.width = parseInt(newrate * 60) + 'px';
		});
		checks = document.querySelectorAll('.rate_radio');
	}
	if(checks){
		checks.forEach(function(item, idx){
			if(idx < newrate){
				item.checked = true;
			}else{
				item.checked = false;
			}
		});		
	}
}
Rating.prototype.showMessage = function(type){
    switch(type){
        case 'rate':
            document.querySelector('.review_rating .warning_msg').style.display = 'block';
            setTimeout(function(){
                document.querySelector('.review_rating .warning_msg').style.display = 'none';
            },1000);            
            break;
        case 'review':
            document.querySelector('.review_contents .warning_msg').style.display = 'block';
            setTimeout(function(){
                document.querySelector('.review_contents .warning_msg').style.display = 'none';
            },1000);    
            break;
    }
}

let rating = new Rating();