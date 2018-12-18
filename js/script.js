var Run=new Runner('#runner');
Number.prototype.inRange=function(a,b){
	return a<=this && this<=b;
};
var finChk;
function startGame(){
	$('#start').remove();
	$('#end').addClass('hide');
	$('#pyre').removeClass('active');
	Run.startRun();
	doScroll();
	genObs();
}

function doScroll(){
	var x=document.documentElement.offsetWidth-5632;
	window.scrollTo(0,0);
	/*
	var g=$('#game');
	g.stop();
	g.css('margin-left',0);
	g.animate({
		marginLeft: x
	},10000,'linear',function(){
		stopGame('finish');
	});*/
	$('html,body').animate({
		scrollLeft: -x
	},10000,'linear',function(){
		stopGame('finish');
	});
}

function restartGame(){
	Run.stopRun();
	
	$('#runner').removeClass('ann');
	
	setTimeout(function(){
		startGame();
	},1)
}

function stopGame(type){
	$('#end>.box>div').addClass('hide');
	$('#end').removeClass('hide');
	Run.stopRun();
	
	if(type=='finish'){
		$('.success').removeClass('hide');
		$('#pyre').addClass('active');
	}
	if(type=='hit'){
		$('.error').removeClass('hide');
		$('#runner').addClass('hit');
	}
}


function Runner(div){
	var runner=$(div);
	var t=this;
	var rI=1,rT,rM=4;
	this.startRun=function(e){
		this.stopRun();
		setTimeout(function(){
			$('html').addClass('active');
			
			runner.addClass('ann').removeClass('hit');
			rT=setInterval(function(){
				var i=(rI%rM)+1;
				runner.attr('step',i);
				rI++;
			},100);	
		},1);
		
		
		
	};
	
	this.stopRun=function(){
		clearInterval(rT);
		$('html').removeClass('active');
		$('#game').stop();
		$('html,body').stop();
	};
	
	this.jumpping=false;
	this.jump=function(){
		if(this.jumpping) return;
		
		this.jumpping=true;
		runner.addClass('jump');
		setTimeout(function(){
			runner.removeClass('jump');	
			setTimeout(function(){
				t.jumpping=false;
			},250);
		},250);
	};
	
	this.way=2;
	this.changeWay=function(offset){
		offset*=1;
		this.way+=offset;
		if(this.way>3) this.way=3;
		if(this.way<1) this.way=1;
		
		runner.attr('runway',this.way);
	};
}

function genObs(){
	var gx=function(){
		var d=40;
		var m=4000/d;
		
		var p=Math.floor(Math.random()*d);
		
		var px=p*m+m;
		
		return px;
	};
	
	var lines=[
		[gx()],
		[gx()],
		[gx()]
	];
	
	for(var i=0;i<3;i++){
		var l=Math.random()*3;
		l=l|0;
		
		lines[l].push(gx());
	}
	
	$('.obstacle').remove();
	
	for(var l=0;l<3;l++){
		var line=lines[l];
		var base=$('#runway'+(l+1));
		
		line.forEach(function(x){
			base.append('<span class="obstacle" style="left:'+x+'px"></span>');
		});
	}
	
}
function chkObsHit(){
	var cline=Run.way;
	var obs=$('#runway'+cline+' .obstacle');
	var mpos=$('#runner').pos();
	var mx=mpos.left+mpos.width/2;
	obs.each(function(){
		var o=$(this);
		var opos=o.pos();
		var ox=opos.left+opos.width/2;
		var ddd=Math.abs(ox-mx);
		if(ddd<50 && !Run.jumpping){
			stopGame('hit');
		}
	});
	//requestAnimationFrame(chkObsHit);
}
setInterval(chkObsHit,100);
//requestAnimationFrame(chkObsHit);




$(document).keydown(function(e){
	var kc=e.keyCode;
	var us=true;
	switch(kc){
		case 38:
			Run.changeWay(-1);
		break;
		case 40:
			Run.changeWay(1);
		break;
		case 32:
			Run.jump();
		break;
		default:
			us=false;
		break;
	}
	
	if(us){
		e.preventDefault();
	}
})

function getPoints(){
	if(getPoints.cache) return getPoints.cache;
	var d={};
	var base=$('#init').pos();
	$('#points>section').each(function(){
		var id=this.id;
		d[id]={
			obj:	$(this),
			panel:	$('#'+id+'Panel'),
			pos:	$(this).pos(base)
		};
	});
	getPoints.cache=d;
	return d;
}
//220
function doAnimation(){
	var base=$('#init').pos();
	var mpos=$('#runner').pos(base);
	var mc=mpos.left+mpos.width/2;
	var ps=getPoints();
	var r=220;
	for(var id in ps){
		var p=ps[id];
		
		if(mc.inRange(p.pos.left+220,p.pos.right-220)){
			p.obj.addClass('active');
			p.panel.addClass('active');
		}else{
			p.obj.removeClass('active');
			p.panel.removeClass('active');
		}
	}
	
	//requestAnimationFrame(doAnimation);

}
//requestAnimationFrame(doAnimation);
setInterval(doAnimation,100);

function asd(){
	$('body').css('overflow','scroll');
	$('#game').css('margin-left',0);
	$('#start,#end').remove();
	$('#runner').draggable().css('pointer-events','all');
}