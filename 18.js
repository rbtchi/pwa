$.i18n = function(options){
    options = $.extend({}, {
        lang: 'en',
        data: $.i18n,
        sliceLang: false
    }, options);

    var langStore = langStore || {},
        lang = options.lang.indexOf('-') < 0 && !options.sliceLang ? options.lang : options.lang.slice(0, 2);

    if( typeof options.data !== 'string' ){
        langStore = options.data[lang];
    } else {
        var urlParts = options.data.match(/(.*)[\/\\]([^\/\\]+)\.(\w+)$/);
        $.ajax({
            url: urlParts[1] + '/' + lang + '.' + urlParts[3],
            dataType: "json", 
            success: function(data) {
                // console.log(data)
                langStore = data;
            },
            error: function(error) {
                console.log(error);
                $.getJSON(urlParts[1] + '/' + lang + '.' + urlParts[3], function(data) {
                    langStore = data;
                });
            }
        });
    }

    var storeData = function(data){
        if(!data) return;
        if(window.localStorage) {
            localStorage.setItem( "langStore", JSON.stringify(data) );
            langStore = data;          
        } else {
            langStore = data;
        }
    };

    if(window.localStorage) {
        var localLangStore = localStorage.getItem("langStore");
        storeData( localLangStore !== null ? JSON.parse(localLangStore) : langStore);
    } else {
        storeData( langStore );
    }

    this.getLang = function(){ return lang; };
    this.setLang = function(l){ lang = l; storeData(options.data[l]); };

    this.getItem = function(key){ return langStore[key]; };
    this.setItem = function(key, value){ options.data[lang][key] = value; storeData(langStore); };

    return this;
};


$.i18n.en = {
    resume: 'MY Resume',
    job: 'Front-end & WebDesginer',
    start: 'Start',
    portfolio: 'Portfolio',
    cl: 'Certificate ＆ License',
    contact: 'contact',
    LanguageSetting: 'Language Setting',
    
    foo: {
        bar: 'bar'
    }
};

$.i18n.zh = {
    resume: '我的個人簡歷',
    job: '前端工程 & 網頁設計',
    start: '開始',
    portfolio: '作品集',
    cl: '證書和執照',
    contact: '與我聯絡',
    LanguageSetting: '語系設定',
    foo: {
        bar: 'foo'
    }
};

$.i18n.jp = {
    resume: '私の履歴書',
    job: 'フロントエンドとWebDesginer',
    start: '開始',
    portfolio: 'ポートフォリオ',
    cl: '証明書とライセンス',
    contact: '私に連絡して',
    LanguageSetting: '言語設定',
    foo: {
        bar: 'foo'
    }
};


var i18n = $.i18n();
console.log(localStorage);
var changeLabels = function(){
    $('.lang').each(function(){
        var forLabel = $(this).attr('for');
        this.innerText = i18n.getItem(forLabel);
    });
};
changeLabels();
    
$('#lang').find('a').click(function(e){
    var lang = this.href.slice(-2);
    i18n.setLang(lang);
    $('#device_language_setting').addClass(lang);
    changeLabels();
    e.preventDefault();
});
