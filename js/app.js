var AppView = Backbone.View.extend({
    el : 'body',
    events : {
        'mouseenter .item-content img':'activate',
        'click .item-content[data-name="start"]':'startExamination'
    },
    // 绑定collection的相关事件
    initialize: function() {
        //为集合Modules的add事件添加处理函数
        Modules.bind('add', this.addOne, this);
        // 调用fetch的时候触发reset
        Modules.bind('reset', this.addAll, this);
        Modules.fetch();
        console.log(Modules.length);
        if(Modules.length==0){
            this.createInitialData();
            Modules.forEach(function(model){
                model.save();
            })
        }

        //初始化时设定第一个为selected
        var module=Modules.get(1);
        var infoview=new InfoView({model:module});
        $('#module-info').html(infoview.render().el);
        $('.item-content[data-name="start"]').addClass('selected');

        //resize
        var adjust=_(function(event){
            var width=$(window).width();
            var factor=20*width/1366;
            $('html').css('font-size',factor+'px');
        }).throttle(100);
        $(window).bind('resize',adjust);
        $(window).trigger('resize');
    },
    createInitialData:function(){
        var start=new Module({
            name:'start',
            title:'我想要开始检查',
            imgSrc:'images/examination.jpg',
            items:['立即开始','设备说明','检查介绍'],
            details:['根据实际情况，选择检查项目','了解设备作用与使用方法','介绍一般检查项目与流程']
        });
        var report=new Module({
            name:'report',
            title:'我想看检查报告',
            imgSrc:'images/result.jpg',
            items:['检查结果','医生建议','历史记录'],
            details:['本次检查结果，异常数据的标注','医生对检查结果的判断与健康建议','结合历史记录，展示完整健康档案']
        });
        var other=new Module({
            name:'other',
            title:'我需要帮助',
            imgSrc:'images/hands.jpg',
            items:['怎么登陆','怎么注销','应用使用说明'],
            details:['帮助登陆系统或者进行用户注册','怎么注销账户与保护隐私','本应用的使用说明，具体功能使用流程']
        });
        Modules.add(start);
        Modules.add(report);
        Modules.add(other);
        console.log(Modules.length+'createInitialData');
    },
    addOne : function(module){
        console.log('addone'+module.get('name'));
        module.set({'id':module.get('id')||Modules.length});
        module.bind('error',function(model,error){
            alert(error);
        });
        var view = new ModuleView({model:module});
        $('#module-list').append(view.render().el);
    },
    addAll : function(){
        Modules.each(this.addOne);
    },
    activate:function(event){
        var $target=$(event.target);
        $('.item-content').removeClass('selected');
        $target.parent().addClass('selected');
        var id=$target.attr('data-module-id');
        
        var left=0,idnum=parseInt(id);
        if(idnum===1){left=23.4;}
        else if(idnum===2){left=48.2;}
        else {left=73.2;}
        $('#indicator').css('left',left+'%');

        var module=Modules.get(id);
        var infoview=new InfoView({model:module});
        $('#module-info').html(infoview.render().el);

        return false;
    },
    startExamination:function(){
        examview=new ExamView();
        $('footer').css('height','36rem');
        $('#indicator').css('opacity','0');
        $('#detail-list li:first').css({'border-color':'#669900','color':'#669900','font-weight':'600'});
    }
});

var ExamView=Backbone.View.extend({
    el:'footer',
    events:{

    },
    initialize:function(){
        Exams.bind('add',this.addOne,this);
        Exams.bind('reset',this.addAll,this);
        Exams.fetch();
        if(Exams.length==0){
            this.createInitialData();
            Exams.forEach(function(model){
                model.save();
            })
        }
    },
    createInitialData:function(){
        var physique=new Exam({
            type:'体格检查',
            device:['听力检测仪','体重计','视力表'],
            items:['内科','外科','妇科','五官科'],
            description:'身高、体重及各种专科检查,了解身体的基本情况'
        });
        var fun=new Exam({
            type:'功能检查',
            device:['心电图机','B型超声诊断仪','CT','多普勒诊断仪'],
            items:['心电图','X光','B超'],
            description:'影像学检查,了解身体功能情况'
        });
        var lab=new Exam({
            type:'化验检查',
            device:['生化分析仪','血球分析仪','显微镜','尿分析仪','乙肝定量化学发光仪'],
            items:['血尿便三常规','血糖、血脂、肝、肾、乙肝五项'],
            description:'一般提取体液进行化验，深入了解身体状况'
        });
        Exams.add(physique);Exams.add(fun);Exams.add(lab);
    }
})

var Modules=new ModuleList();
var Exams=new ExamList();
var appview=new AppView();
var examview;