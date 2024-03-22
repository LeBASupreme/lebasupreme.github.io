
const logo = document.querySelectorAll(".navLogo")
const nav1 = document.querySelectorAll(".nav1")
const nav2 = document.querySelectorAll(".nav2")
const nav3 = document.querySelectorAll(".nav3")

const header1 =document.querySelectorAll(".presentation")
const header2=document.querySelectorAll(".logo")
const header3 =document.querySelectorAll(".je")
const header4 =document.querySelectorAll(".suis")
const header5 =document.querySelectorAll(".name")

window.addEventListener('load', ()=> {
    const TL=gsap.timeline({paused:true});
    TL.staggerFrom(logo,0.4,{top:-50, opacity:0,ease:"power2.out"},0.3)
    TL.staggerFrom(nav1,0.4,{top:-50, opacity:0,ease:"power2.out"},0.3)
    TL.staggerFrom(nav2,0.4,{top:-50, opacity:0,ease:"power2.out"},0.3)
    TL.staggerFrom(nav3,0.4,{top:-50, opacity:0,ease:"power2.out"},0.3)
    TL.from(header1,4,{top:-50, opacity:0,ease:"power2.out"}, 1.4)
    TL.from(header2,6,{top:-50, opacity:0,ease:"power2.out"}, 2)
    /*
    TL.from(header3,4,{top:-50, opacity:0,ease:"power2.out"}, 1)
    TL.from(header4,4,{top:-50, opacity:0,ease:"power2.out"}, 1)
    TL.from(header5,4,{top:-50, opacity:0,ease:"power2.out"}, 1)
    */
    TL.play();
})