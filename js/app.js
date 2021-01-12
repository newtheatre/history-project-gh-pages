var AnimatedScroll,scrollToAnimated,LazyController,LazyImage,PeopleGrid,PeopleResult,PeopleResults,PeopleSearch,ProdShotsGallery,RelativeTime,ARCHIVE_SORT_LIST,SORT_DROPDOWN,sort_items,PEOPLE_FEED,TEMPLATE_DATA,collectBindEvents,collectPersonFormSetup,disableCollectForm,enableCollectForm,debounce,delay,getUrlParameter,isMobile,bindKeys,Lightbox,LightboxGallery,ReportModel,disableReportForm,enableReportForm,freezeScrolling,frozenScrollTop,reportThanks,unfreezeScrolling,INDEX_URL,REVERSE_INDEX_URL,SearchResultView,configureWindow,doSearch,index,indexReady,loadIndex,reverse_index;AnimatedScroll=class{constructor(e,t){this.step=this.step.bind(this),this.scrollStart=window.scrollY,this.scrollStep=Math.PI/t,this.cosParameter=(this.scrollStart-e)/2,this.scrollEnd=e,this.scrollDuration=t,this.scrollCount=0,this.firstTs=null}go(){return requestAnimationFrame(this.step)}step(e){var t,s;return this.firstTs||(this.firstTs=e),(t=e-this.firstTs)<=this.scrollDuration?(requestAnimationFrame(this.step),s=this.cosParameter-this.cosParameter*Math.cos(t*this.scrollStep),window.scrollTo(0,this.scrollStart-s)):window.scrollTo(0,this.scrollEnd)}},scrollToAnimated=function(e,t){return new AnimatedScroll(e,t).go()},LazyImage=function(){var e;return"lazy-image",e=660,class{constructor(e){this.load=this.load.bind(this),this.update=this.update.bind(this),this.imgEl=e.imgEl,this.imgSrc=this.imgEl.dataset.src,this.imgSrcSet=this.imgEl.dataset.srcset,window.requestAnimationFrame(this.update)}load(){return this.imgEl.src=this.imgSrc,this.imgEl.srcset=this.imgSrcSet}update(){return window.scrollY!==this.lastScroll&&this.imgEl.getBoundingClientRect().top<window.innerHeight+e?this.load():(window.requestAnimationFrame(this.update),this.lastScroll=window.scrollY)}}}.call(this),LazyController=class{},document.addEventListener("turbolinks:load",(function(){var e,t,s,r,i;for(i=[],e=0,r=(s=document.querySelectorAll("[data-src]")).length;e<r;e++)t=s[e],i.push(new LazyImage({imgEl:t}));return i})),PeopleGrid=class{constructor(e){this.update=this.update.bind(this),this.gridEl=e.gridEl,this.scrollerEl=e.scrollerEl,this.gridScrollEls=this.gridEl.querySelectorAll(".scroll-detect"),this.gridActiveEl=null,this.windowPos=-1,this.currentEl=null,this.enabled=!0,window.requestAnimationFrame(this.update)}update(e){var t,s,r,i,l,o,n;if(this.windowPos===window.scrollY)return this.enabled&&window.requestAnimationFrame(this.update),this.windowPos=window.scrollY,0;for(this.windowPos=window.scrollY,l=this.gridScrollEls[0],i=0,o=(n=this.gridScrollEls).length;i<o;i++){if((t=(s=n[i]).getBoundingClientRect().top)>60){this.currentEl!==l&&this.setCurrent(l),r=!0;break}l=s}return r||t<60&&this.currentEl!==l&&this.setCurrent(l),this.enabled?window.requestAnimationFrame(this.update):void 0}setCurrent(e){var t,s;return s=e.dataset.sortLabel,(t=this.scrollerEl.querySelector(".active"))&&t.classList.remove("active"),this.scrollerEl.querySelector(`[data-sort='${s}']`).classList.add("active"),this.currentEl=e}destructor(){return this.enabled=!1}},document.addEventListener("turbolinks:load",(function(){var e,t;if(window.peopleGridEl&&(window.peopleGridEl.destructor(),delete window.peopleGridEl),e=document.querySelector("#pg"),t=document.querySelector("#pgScroller"),e)return window.prodShotsGallery=new PeopleGrid({gridEl:e,scrollerEl:t})})),PeopleSearch=function(){var e,t,s,r,i,l,o,n,a;return a="/js/search_worker.js",n="/feeds/people_index.json",o="/feeds/people.json",e=[["people-filter-name",""],["people-filter-graduated","graduated"],["people-filter-career","career"],["people-filter-course","course"],["people-filter-award","award"],["people-filter-srole","srole"],["people-filter-crole","crole"]],r=27,s="people-index__filters--fixed",i="people-index__filters__more--open",l="people-index__filters__toggle--open",t="people-index--push",class{constructor(e){this.onSearch=this.onSearch.bind(this),this.onMessage=this.onMessage.bind(this),this.toggleMore=this.toggleMore.bind(this),this.update=this.update.bind(this),this.enabled=!0,this.psFilterEl=e.psFilterEl,this.psMoreEl=this.psFilterEl.querySelector("#psMore"),this.psMoreToggleEl=this.psFilterEl.querySelector("#psMoreToggle"),this.psBodyEl=e.psBodyEl,this.psResults=new PeopleResults({psResultsEl:e.psResultsEl}),this.footerEl=document.querySelector(".site-footer"),this.moreIsOpen=!1,this.scrollIsFixed=!1,this.searchWorker=new Worker(a),this.searchWorker.postMessage({cmd:"init",indexUrl:n,dataUrl:o}),this.searchWorker.addEventListener("message",this.onMessage),this.bindSearchFields(),this.psMoreToggleEl.addEventListener("click",this.toggleMore),this.psFilterElOffsetTop=$(this.psFilterEl).offset().top,this.psFilterHeight=this.psFilterEl.offsetHeight,window.requestAnimationFrame(this.update)}destructor(){return this.searchWorker.postMessage({cmd:"stop"}),this.enabled=!1}bindSearchFields(){var t,s,r,i,l;for(this.searchFields=Array(),l=[],r=0,i=e.length;r<i;r++)s=e[r],t=document.getElementById(s[0]),0===e.indexOf(s)?t.addEventListener("input",debounce(()=>this.onSearch())):t.addEventListener("change",this.onSearch),l.push(this.searchFields.push([t,s[1]]));return l}searchTerm(){var e,t,s,r,i;for(r=Array(),t=0,s=(i=this.searchFields).length;t<s;t++)""===(e=i[t])[1]&&""!==e[0].value?r.push(e[0].value):""!==e[0].value&&r.push(`${e[1]}:${e[0].value}`.replace(/ /g,"_"));return r.join(" ")}onSearch(){var e;return(e=this.searchTerm()).length>0?this.searchWorker.postMessage({cmd:"search",query:e}):this.psResults.clear()}onMessage(e){var t;switch((t=e.data).cmd){case"ready":return $(this.searchFields[0][0]).attr("placeholder","");case"results":return this.psResults.render(t.results)}}toggleMore(){return this.moreIsOpen=!this.moreIsOpen,this.psMoreEl.classList.toggle(i),this.scrollIsFixed&&this.psBodyEl.classList.toggle(t),this.psMoreToggleEl.classList.toggle(l)}update(){var e,i;if(this.windowPos!==window.scrollY&&(i=isMobile()?this.psFilterElOffsetTop:this.psFilterElOffsetTop-r,window.scrollY>i&&!this.scrollIsFixed?(this.scrollIsFixed=!0,this.psFilterEl.classList.add(s),isMobile()&&(this.psBodyEl.style.paddingTop=`${this.psFilterHeight+6}px`),isMobile()&&this.moreIsOpen&&(this.psBodyEl.classList.add("noTransition"),this.psBodyEl.classList.add(t),this.psBodyEl.offsetHeight,this.psBodyEl.classList.remove("noTransition"))):window.scrollY>i||!this.scrollIsFixed||(this.scrollIsFixed=!1,this.psFilterEl.classList.remove(s),isMobile()&&(this.psBodyEl.style.paddingTop=""),isMobile()&&(this.psBodyEl.classList.add("noTransition"),this.psBodyEl.classList.remove(t),this.psBodyEl.offsetHeight,this.psBodyEl.classList.remove("noTransition"))),(e=$(this.footerEl).offset().top-window.scrollY-(this.psFilterEl.getBoundingClientRect().height+r))<r&&!isMobile()?this.psFilterEl.style.top=`${e}px`:this.psFilterEl.style.top=""),this.windowPos=window.scrollY,this.enabled)return window.requestAnimationFrame(this.update)}}}.call(this),PeopleResults=class{constructor(e){this.psResultsEl=e.psResultsEl,this.psEmptyTemplate=_.template(document.getElementById("psResultEmpty").textContent),this.psIntro=document.getElementById("psIntro")}clear(){var e;for(null!=this.psIntro&&(this.psIntro.parentNode.removeChild(this.psIntro),delete this.psIntro),e=[];this.psResultsEl.hasChildNodes();)e.push(this.psResultsEl.removeChild(this.psResultsEl.lastChild));return e}render(e){var t,s,r,i,l;for(this.clear(),0===e.length&&(this.psResultsEl.innerHTML=this.psEmptyTemplate()),Array(),l=[],t=0,s=e.length;t<s;t++)i=e[t],r=new PeopleResult(i),l.push(this.psResultsEl.appendChild(r.render()));return l}},PeopleResult=function(){var e;return e="psResultTemplate",class{constructor(e){this.result=e,this.node=document.createElement("li")}getTemplate(){return _.template(document.getElementById(e).textContent)}render(){var e;return e=this.getTemplate()({item:this.result}),this.node.innerHTML=e,this.node}}}.call(this),document.addEventListener("turbolinks:load",(function(){var e,t,s;if(window.peopleSearch&&(window.peopleSearch.destructor(),delete window.peopleSearch),t=document.querySelector("#psFilter"),e=document.querySelector("#psBody"),s=document.querySelector("#psResults"),t&&s)return window.peopleSearch=new PeopleSearch({psFilterEl:t,psBodyEl:e,psResultsEl:s})})),ProdShotsGallery=function(){class e{constructor(e){this.toggleClick=this.toggleClick.bind(this),this.openGallery=this.openGallery.bind(this),this.closeGallery=this.closeGallery.bind(this),this.computeControlStickyness=this.computeControlStickyness.bind(this),this.elemContainer=e.elemContainer,this.toggleButton=this.elemContainer.querySelector("[data-gallery-toggle]"),this.showLabel=this.elemContainer.querySelector("[data-show-label]"),this.hideLabel=this.elemContainer.querySelector("[data-hide-label]"),this.fadeOverlay=this.elemContainer.querySelector(".fade-out-overlay"),this.gallery=this.elemContainer.querySelector(".show-photos"),this.galleryInner=this.elemContainer.querySelector(".show-photos__inner"),this.galleryOpen,this.controls=this.elemContainer.querySelector(".show-photos-controls"),this.lazyImages=this.elemContainer.querySelectorAll(".lazy-image"),this.lazyComplete=!1,this.preLazyLoad(),this.limitedGallery="none"===this.elemContainer.querySelector(".gallery-control").style.display,this.limitedGallery||(this.toggleButton.addEventListener("click",this.toggleClick),this.fadeOverlay.addEventListener("click",this.toggleClick),window.requestAnimationFrame(this.computeControlStickyness))}preLazyLoad(){var e,t,s,r;for(r=[],t=e=0,s=this.limitedGallery?this.maxImages.limited:this.maxImages.full;0<=s?e<=s:e>=s;t=0<=s?++e:--e)this.lazyImages[t]?r.push(this.lazyLoad(this.lazyImages[t])):r.push(void 0);return r}lazyLoad(e){if(e.src!==e.dataset.lazySrc)return e.src=e.dataset.lazySrc}lazyLoads(e){var t,s,r;for(s=0,r=e.length;s<r;s++)t=e[s],this.lazyLoad(t);return this.lazyComplete=!0}toggleClick(e){return e.preventDefault(),this.toggleButton.blur(),this.galleryOpen?this.closeGallery(e):this.openGallery(e)}openGallery(e){return this.galleryInner.classList.add("show-photos__inner--show"),this.controls.classList.add("show-photos-controls--sticky"),this.galleryInner.style.maxHeight=`${this.galleryInner.scrollHeight}px`,this.showLabel.style.display="none",this.fadeOverlay.style.display="none",this.hideLabel.style.display="block",this.lazyComplete||this.lazyLoads(this.lazyImages),this.galleryOpen=!0}closeGallery(e){return this.galleryInner.classList.remove("show-photos__inner--show"),this.controls.classList.remove("show-photos-controls--sticky"),this.galleryInner.style.maxHeight="",this.showLabel.style.display="block",this.fadeOverlay.style.display="block",this.hideLabel.style.display="none",this.galleryOpen=!1,scrollToAnimated(this.gallery.offsetTop-200,160)}computeControlStickyness(){var e,t,s;return this.galleryOpen?(s=window.scrollY+window.innerHeight,t=this.gallery.offsetTop,s>this.gallery.offsetHeight+this.gallery.offsetTop+(e=this.controls.offsetHeight)||s<t+e?(this.controls.classList.remove("show-photos-controls--sticky"),this.elemContainer.style.paddingBottom=""):(this.controls.classList.add("show-photos-controls--sticky"),this.elemContainer.style.paddingBottom=`${e}px`)):this.elemContainer.style.paddingBottom="",window.requestAnimationFrame(this.computeControlStickyness)}}return e.prototype.maxImages={limited:4,full:12},e}.call(this),document.addEventListener("turbolinks:load",(function(){var e;if(e=document.querySelector("#show-prod-shots"))return window.prodShotsGallery=new ProdShotsGallery({elemContainer:e})})),RelativeTime=class{constructor(e){this.el=e.el,this.render()}format(){return moment(this.el.dataset.date,"YYYY-MM-DD").startOf("day").fromNow()}render(){return this.el.innerHTML=this.format()}},document.addEventListener("turbolinks:load",(function(){var e,t,s,r,i;for(i=[],e=0,t=(r=document.querySelectorAll("[data-date]")).length;e<t;e++)s=r[e],i.push(new RelativeTime({el:s}));return i})),ARCHIVE_SORT_LIST="#archive-sort-list",SORT_DROPDOWN="#archive-sort-dropdown",sort_items=function(e,t){var s;return s=$(e).children().sort((function(e,s){var r,i,l,o;return r=$(e).data(t),l=$(s).data(t),i=$(e).data("alpha"),o=$(s).data("alpha"),"alpha"===t?+((r=r.toLowerCase())>(l=l.toLowerCase()))||+(r===l)-1:l-r!=0?l-r:+(i>o)||+(i===o)-1})),$(e).html(s)},document.addEventListener("turbolinks:load",(function(){return $(SORT_DROPDOWN).change((function(){return sort_items(ARCHIVE_SORT_LIST,$(this).val())}))})),collectBindEvents=function(){return $('input[type="checkbox"]').change((function(){return $(this).closest("label").toggleClass("child-checked",this.checked)})),$("#collect-show-form").submit((function(e){var t,s,r;return e.preventDefault(),t=$(this).serializeArray(),s={},t.forEach((function(e){return s[e.name]=e.value})),r=`# 'Tell us about a show' form submission\n\nField | Data\n----- | ----\nTitle | ${s.title}\nPlaywright | ${s.playwright}\nDate Start | ${s.date_start_day} / ${s.date_start_month} / ${s.date_start_year}\nDate End | ${s.date_end_day} / ${s.date_end_month} / ${s.date_end_year}\nType | ${s.type}\nVenue | ${s.venue}\n\n## Synopsis\n\n${s.synopsis}\n\n## Cast\n\n${s.cast}\n\n## Crew\n\n${s.crew}\n\n## Anything Else\n\n${s.other}\n\n## Submitter\n\nField | Data\n----- | ----\nName | ${s.name}\nGraduated | ${s.graduation}\n\n## Attempted File Generation\n\n\`\`\`\n---\ntitle: ${s.title}\nplaywright: ${s.playwright}\nseason: ??? (${s.type})\nseason_sort: ??\nperiod: ??\nvenue:\n  - ${s.venue}\ndate_start: ${s.date_start_year}-${s.date_start_month}-${s.date_start_day}\ndate_end: ${s.date_end_year}-${s.date_end_month}-${s.date_end_day}\n\ncast:\n  - role:\n    name:\n\ncrew:\n  - role: Director\n    name:\n  - role: Producer\n    name:\n\ncomment: Details from ${s.name} (${s.graduation})\npublished: true\n---\n\n${s.synopsis}\n\`\`\``,{title:s.title,message:r,name:"",page_url:"/collect/show/"},new ReportModel({title:s.title,message:r,name:"",page_url:"/collect/show/",url:$(this).attr("action")}).save({success:function(e){return Turbolinks.visit("/collect/show/thanks/")},error:function(e){return enableCollectForm()}}),disableCollectForm()})),$("#collect-person-form").submit((function(e){var t,s,r,i,l,o,n;return e.preventDefault(),i=$(this).serializeArray(),o={},i.forEach((function(e){return o[e.name]=e.value.replace(/[^\x00-\x7F]/g,"")})),l={contact_allowed_yn:"on"===o.contact_allowed?"Yes":"No",contact_allowed_tf:"on"===o.contact_allowed?"true":"false"},t=[],s="",r="",$(".career-choice").each((function(e){if(this.checked)return t.push($(this).attr("name")),s+=$(this).attr("name")+", ",r+="  - "+$(this).attr("name")+"\n"})),n=`# 'Submit an alumni bio' form submission\n\nField | Data\n----- | ----\nName | ${o.name}\nGrad Year | ${o.graduation}\nCourse | ${o.course}\n\n## Bio1 (Time at theatre)\n\n${o.bio1}\n\n## Bio2 (Post-graduation)\n\n${o.bio2}\n\nField | Data\n------| ----\nChecked careers | ${s}\nOther careers | ${o["career-other"]}\n\n## Links\n\n${o.links}\n\n## Shows\n\n${o.shows}\n\n## Committees\n\n${o.committees}\n\n## Awards\n\n${o.awards}\n\n## Contact Preferences\n\nAre we allowed to facilitate contact to this alumnus? **${l.contact_allowed_yn}**\n\n## Attempted File Generation\n\n\`\`\`\n---\ntitle: ${o.name}\ncourse:\n  - ${o.course}\ngraduated: ${o.graduation}\ncontact_allowed: ${l.contact_allowed_tf}\ncareers:\n${r}\n${o["career-other"]}\nlinks: *fill me out\n${o.links}\naward: *fill me out\n${o.awards}\n---\n\n${o.bio1}\n\n${o.bio2}\n\n\`\`\``,window.message=n,new ReportModel({title:o.name+" bio submission",message:n,name:"",page_url:"/collect/person/",url:$(this).attr("action")}).save({success:function(e){return Turbolinks.visit("/collect/person/thanks/")},error:function(e){return enableCollectForm()}}),disableCollectForm()}))},PEOPLE_FEED="/feeds/people-collect.json",TEMPLATE_DATA="#collect-template-list",collectPersonFormSetup=function(){var e;if(collectBindEvents(),(e=getUrlParameter("name"))&&e.length>0)return $.get(PEOPLE_FEED,(function(t){var s,r,i,l,o,n,a,d,h;if(e in t){for($("[data-have-details-show]").show(),$("[data-have-details-style]").addClass("collect-has-data"),$(".collect-field-name").val(t[e].name),$(".collect-field-graduation").val(t[e].graduated),$(".collect-field-course").val(t[e].course),$(".collect-field-bio1").val(t[e].bio),h=_.template($(TEMPLATE_DATA).html()),s=0,l=(n=t[e].shows).length;s<l;s++)r=n[s],$("[data-have-details-shows-hide]").hide(),$("#collect-shows .collect-person-data").append(h({item:r}));for(d=[],i=0,o=(a=t[e].committees).length;i<o;i++)r=a[i],$("[data-have-details-committees-hide]").hide(),d.push($("#collect-committees .collect-person-data").append(h({item:r})));return d}}),"json")},disableCollectForm=function(){return $(".collect-submit").attr("disabled",!0),$(".collect-submit").addClass("disabled"),$(".collect-submit").html('<i class="fa fa-circle-o-notch fa-spin"></i>')},enableCollectForm=function(){return $(".collect-submit").attr("disabled",!1),$(".collect-submit").removeClass("disabled"),$(".collect-submit").html("Try Again")},document.addEventListener("turbolinks:load",(function(){if($("body").hasClass("collect-person-form"))return collectPersonFormSetup()})),window.GITHUB_ISSUES_USER="newtheatre",window.GITHUB_ISSUES_REPO="history-project",delay=function(e,t){return setTimeout(t,e)},getUrlParameter=function(e){var t;return(t=RegExp("[?&]"+e+"=([^&]*)").exec(window.location.search))&&decodeURIComponent(t[1].replace(/\+/g," "))},debounce=function(e){var t;return t=void 0,function(){var s,r;return s=Array.prototype.slice.call(arguments),r=this,clearTimeout(t),t=setTimeout((function(){e.apply(r,s)}),40)}},isMobile=function(){return"block"===$("#nthpMobileDetect").css("display")},window.im=isMobile,document.addEventListener("turbolinks:load",(function(){return $("#site-search-show").click((function(){return $("#site-search").addClass("elem-show"),$("#site-search-bg").removeClass("elem-hidden"),$("#q").focus()})),$("#site-search-bg").click((function(){return $("#site-search").removeClass("elem-show"),$("#site-search-bg").addClass("elem-hidden")}))})),bindKeys=function(){return Mousetrap.bind("left",(function(){if("undefined"!=typeof jekyll_page_previous&&null!==jekyll_page_previous&&!window.disable_keyboard_nav)return Turbolinks.visit(jekyll_page_previous)})),Mousetrap.bind("right",(function(){if("undefined"!=typeof jekyll_page_next&&null!==jekyll_page_next&&!window.disable_keyboard_nav)return Turbolinks.visit(jekyll_page_next)})),Mousetrap.bind("e d i t o r",(function(){return"yes"===localStorage.debug_mode?(localStorage.debug_mode="no",$("[data-debug-toggle]").hide()):(localStorage.debug_mode="yes",$("[data-debug-toggle]").show())}))},window.disable_keyboard_nav=!1,document.addEventListener("DOMContentLoaded",(function(){return bindKeys()})),document.addEventListener("turbolinks:load",(function(){if("yes"===localStorage.debug_mode)return $("[data-debug-toggle]").show()})),document.addEventListener("turbolinks:visit",(function(){return window.jekyll_page_up=null,window.jekyll_page_previous=null,window.jekyll_page_next=null})),document.addEventListener("turbolinks:load",(function(){return $(".js-lettering").lettering()})),LightboxGallery=class{constructor(e){var t,s,r;for(this.imageClick=this.imageClick.bind(this),this.deleteLightbox=this.deleteLightbox.bind(this),this.galleryEm=e,this.galleryLinks=e.querySelectorAll(".lightbox-link"),t=0,s=(r=this.galleryLinks).length;t<s;t++)r[t].addEventListener("click",this.imageClick)}imageClick(e){var t;return e.preventDefault(),e.srcElement.blur(),t=this.getLinkIndex(e.srcElement.parentElement),this.lightbox=new Lightbox(this,t),window.currentLightbox=this.lightbox}getLinkIndex(e){var t,s,r,i;for(t=s=0,r=(i=this.galleryLinks).length;s<r;t=++s)if(e===i[t])return t}deleteLightbox(){return delete this.lightbox}},Lightbox=class{constructor(e,t){this.nextImage=this.nextImage.bind(this),this.prevImage=this.prevImage.bind(this),this.imageLoaded=this.imageLoaded.bind(this),this.videoLoaded=this.videoLoaded.bind(this),this.close=this.close.bind(this),this.lightboxGallery=e,this.i=t,this.blur=document.getElementById("lightbox-blur"),this.blur.classList.add("lightbox-blur--show"),this.blur.addEventListener("click",this.close),this.addElement(),this.changeImage(t),Mousetrap.unbind("left"),Mousetrap.bind("left",this.prevImage),Mousetrap.unbind("right"),Mousetrap.bind("right",this.nextImage),Mousetrap.bind("esc",this.close),window.disable_keyboard_nav=!0,this.scrollTop=$(document).scrollTop(),document.body.style.position="fixed",document.body.style.top=`-${this.scrollTop}px`}addElement(){var e,t,s;if(this.lb=document.createElement("div"),this.lb.classList.add("lightbox-box"),this.lb.innerHTML='<div class="lightbox-box__inner">\n  <div title="Previous" class="lightbox-box__prev">\n    <i class="ion-chevron-left"></i>\n  </div>\n  <div title="Next" class="lightbox-box__next">\n    <i class="ion-chevron-right"></i>\n  </div>\n  <div title="Close" class="lightbox-box__close">\n    <i class="ion-close-circled"></i>\n  </div>\n  <div class="lightbox-box__load">\n    <i class="ion-load-c"></i>\n  </div>\n  <div class="lightbox-box__content">\n\n  </div>\n</div>',document.body.appendChild(this.lb),s=this.lb.querySelector(".lightbox-box__prev"),t=this.lb.querySelector(".lightbox-box__next"),e=this.lb.querySelector(".lightbox-box__close"),s.addEventListener("click",this.prevImage),t.addEventListener("click",this.nextImage),e.addEventListener("click",this.close),this.loadSpinnerEl=this.lb.querySelector(".lightbox-box__load"),this.contentEl=this.lb.querySelector(".lightbox-box__content"),this.imageEl=null,this.videoEl=null,1===this.lightboxGallery.galleryLinks.length)return s.remove(),t.remove()}nextImage(){return this.i+1<this.lightboxGallery.galleryLinks.length?this.changeImage(this.i+1):this.changeImage(0)}prevImage(){return this.i-1>=0?this.changeImage(this.i-1):this.changeImage(this.lightboxGallery.galleryLinks.length-1)}setupImage(){return this.contentEl.innerHTML='<img class="lightbox-box__image" src="" alt="" />',this.videoEl=null,this.imageEl=this.contentEl.querySelector(".lightbox-box__image"),this.imageEl.addEventListener("load",this.imageLoaded)}imageLoaded(e){return this.loadSpinnerEl.classList.remove("lightbox-box__load--show"),this.imageEl.classList.remove("lightbox-box__image--load")}setupVideo(e){return this.contentEl.innerHTML=`<video class="lightbox-box__video lightbox-box__video--load" controls autoplay>\n  <source src="${e}" type="video/mp4" />\n</video>`,this.imageEl=null,this.videoEl=this.contentEl.querySelector(".lightbox-box__video"),this.videoEl.addEventListener("playing",this.videoLoaded)}videoLoaded(e){return this.loadSpinnerEl.classList.remove("lightbox-box__load--show"),this.videoEl.classList.remove("lightbox-box__video--load"),e.target.removeEventListener(e.type,arguments.callee)}changeImage(e){switch(this.loadSpinnerEl.classList.add("lightbox-box__load--show"),this.lightboxGallery.galleryLinks[e].dataset.type){case"image":this.imageEl||this.setupImage(),this.imageEl.classList.add("lightbox-box__image--load"),this.imageEl.src=this.lightboxGallery.galleryLinks[e].href;break;case"video":this.setupVideo(this.lightboxGallery.galleryLinks[e].href);break;default:console.error("Invalid lightbox gallery type")}return this.i=e}close(){return document.body.style.position="static",$(document).scrollTop(this.scrollTop),this.blur.classList.remove("lightbox-blur--show"),this.blur.removeEventListener("click",this.close),document.body.removeChild(this.lb),this.lightboxGallery.deleteLightbox(),bindKeys(),Mousetrap.unbind("esc"),window.disable_keyboard_nav=!1}},document.addEventListener("turbolinks:load",(function(){var e,t,s,r,i;for(r=[],s=0,i=(t=document.querySelectorAll(".lightbox-group")).length;s<i;s++)e=t[s],r.push(new LightboxGallery(e));return window.lbs=r})),ReportModel=class{constructor(e){this.buildJSON=this.buildJSON.bind(this),this.title=e.title,this.page_url=e.page_url,this.message=e.message,this.name=e.name,this.url=e.url}buildJSON(){return JSON.stringify({title:this.title,page_url:this.page_url,message:this.message,name:this.name})}save(e){var t,s;return t=this.url,s=this.buildJSON(),window.reportModelData=s,$.ajax({url:t,type:"POST",data:s,success:function(t,s,r){return"success"===t.status?e.success(t):(alert("There was a problem with the data your provided"),e.error())},error:function(e,t,s){return alert("Oops, something went wrong"),error()}})}},disableReportForm=function(){return $(".report-submit").attr("disabled",!0),$(".report-submit").addClass("disabled"),$(".report-submit").html('<i class="fa fa-circle-o-notch fa-spin"></i>')},enableReportForm=function(){return $(".report-submit").attr("disabled",!1),$(".report-submit").removeClass("disabled"),$(".report-submit").html("Try Again")},reportThanks=function(e){var t;return t=_.template($("#report-success-template").html()),$("#report-modal-content").html(t({url:e}))},frozenScrollTop=null,freezeScrolling=function(){return frozenScrollTop=$(document).scrollTop(),document.body.style.position="fixed",document.body.style.top=`-${frozenScrollTop}px`},unfreezeScrolling=function(){return document.body.style.position="static",$(document).scrollTop(frozenScrollTop)},document.addEventListener("turbolinks:load",(function(){return $("#report-this-page").click((function(e){return e.preventDefault(),freezeScrolling(),$("#report").addClass("report-show")})),$("[data-report-close]").click((function(e){return e.preventDefault(),unfreezeScrolling(),$("#report").removeClass("report-show"),$("#improve").removeClass("report-show")})),$("#improve-this-page").click((function(e){if("yes"!==localStorage.debug_mode)return e.preventDefault(),freezeScrolling(),$("#improve").addClass("report-show")})),$("[data-improve-close]").click((function(e){return e.preventDefault(),unfreezeScrolling(),$("#improve").removeClass("report-show")})),$("[data-report-this-page]").click((function(e){return e.preventDefault(),freezeScrolling(),$("#improve").removeClass("report-show"),$("#report").addClass("report-show")})),$("#report-issue-form").submit((function(e){return e.preventDefault(),new ReportModel({title:$("#report-title",this).val(),page_url:$("#report-page_url",this).val(),message:$("#report-message",this).val(),name:$("#report-name",this).val(),url:$(this).attr("action")}).save({success:function(e){return reportThanks(e.url)},error:function(e){return enableReportForm()}}),disableReportForm()}))})),INDEX_URL="/feeds/search_index.json",REVERSE_INDEX_URL="/feeds/search_index_reverse.json",indexReady=function(){return configureWindow()},configureWindow=function(){var e,t;return e=new SearchResultView,window.sView=e,null!==(t=getUrlParameter("q"))?(e.search(t),$("#q").val(t)):e.renderBlank(),$("#q").focus(),$("#q").keyup(debounce((function(){var t;return $(this).val().length<2?e.renderBlank():(t=$(this).val(),e.search(t))})))},index=new Object,reverse_index=new Object,loadIndex=function(){return console.time("loadIndex"),$.get(INDEX_URL,(function(e){return index=lunr.Index.load(e),$.get(REVERSE_INDEX_URL,(function(e){return reverse_index=e,indexReady()}),"json")}),"json"),console.timeEnd("loadIndex")},doSearch=function(e){var t,s;return t=index.search(e),s=new Array,t.forEach((function(e){return s.push(reverse_index[e.ref])})),s},window.doSearch=doSearch,SearchResultView=function(){var e,t,s;return s="#search-result",t="#search-message-empty",e="[data-search-results]",class{getSingleTemplate(){return _.template($(s).html())}search(e){return this.query=e,this.render()}render(){var e;return(e=doSearch(this.query)).length>0?this.renderResults(e):this.renderEmpty()}renderResults(t){var s,r;return r=this.getSingleTemplate(),s=[],t.forEach((function(e){return s.push(r({item:e}))})),$(e).html(s)}renderEmpty(){var s;return s=_.template($(t).html())({query:this.query}),$(e).html(s)}renderBlank(){return $(e).html("\x3c!-- BLANK --\x3e")}}}.call(this),document.addEventListener("turbolinks:load",(function(){var e;if($("body").hasClass("search")&&(loadIndex(),null!==(e=getUrlParameter("q"))))return $("#q").val(e)}));
//# sourceMappingURL=app.js.map
