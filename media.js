// Add authorized book page images and a video source when ready.
export const books = [
 {id:'01',size:'tall',pages:Array(8).fill('')},
 {id:'02',size:'small',pages:Array(6).fill('')},
 {id:'03',size:'wide',pages:Array(8).fill('')},
 {id:'04',size:'medium',pages:Array(6).fill('')}
];
export const film = {src:'',poster:''};
export function bookShelf(t){return `<section class="book-shelf" aria-label="${t('四本书籍','Four books')}">${books.map(b=>`<button class="closed-book ${b.size}" data-book="${b.id}" aria-label="${t('打开书籍','Open book')} ${b.id}"><span>${b.id}</span></button>`).join('')}</section><dialog class="book-dialog" aria-label="${t('书籍阅读器','Book reader')}"><button class="reader-close" aria-label="${t('关闭书籍','Close book')}">×</button><div class="spread" tabindex="0" aria-label="${t('左右方向键翻页','Use arrow keys to turn pages')}"></div><div class="reader-controls"><button class="prev-page" aria-label="${t('上一页','Previous spread')}">←</button><span class="page-status" aria-live="polite"></span><button class="next-page" aria-label="${t('下一页','Next spread')}">→</button></div></dialog>`;}
export function videoGallery(t){return `<section class="film-stage"><button class="film-frame" aria-label="${t('打开视频','Open video')}"><span class="play-triangle" aria-hidden="true"></span></button></section><dialog class="film-dialog" aria-label="${t('视频播放器','Video player')}"><button class="reader-close" aria-label="${t('关闭视频','Close video')}">×</button><video ${film.src?'': 'hidden'} controls playsinline preload="metadata" ${film.poster?`poster="${film.poster}"`:''} ${film.src?`src="${film.src}"`:''}></video><p class="video-pending" ${film.src?'hidden':''}>${t('视频待添加','Video pending')}</p></dialog>`;}
export function setupMedia(root,t,reduced){
 const dialog=root.querySelector('.book-dialog');
 if(dialog){let book,spread=0,trigger,turning=false;
  const canvas=dialog.querySelector('.spread'),prev=dialog.querySelector('.prev-page'),next=dialog.querySelector('.next-page');
  function paint(){canvas.className=`spread ${book.size}`;canvas.innerHTML=[spread*2,spread*2+1].map((n,i)=>`<button class="paper ${i?'right':'left'}" data-turn="${i?1:-1}" aria-label="${i?t('下一页','Next spread'):t('上一页','Previous spread')}">${book.pages[n]?`<img src="${book.pages[n]}" alt="${t('书页','Page')} ${n+1}">`:''}<span class="folio">${n+1}</span></button>`).join('');prev.disabled=spread===0;next.disabled=spread*2+2>=book.pages.length;dialog.querySelector('.page-status').textContent=`${book.id} / ${spread*2+1}–${spread*2+2} / ${book.pages.length}`;}
  function turn(step){if(turning||!book)return;const value=spread+step;if(value<0||value>=Math.ceil(book.pages.length/2))return;if(reduced.matches){spread=value;paint();return;}turning=true;const leaf=canvas.querySelector(step>0?'.right':'.left');const animation=leaf.animate([{transform:'rotateY(0deg)',filter:'brightness(1)'},{transform:`rotateY(${step>0?-85:85}deg)`,filter:'brightness(.85)'}],{duration:220,easing:'ease-in',fill:'forwards'});animation.finished.then(()=>{if(!dialog.open)return;spread=value;paint();const incoming=canvas.querySelector(step>0?'.left':'.right');incoming.animate([{transform:`rotateY(${step>0?85:-85}deg)`},{transform:'rotateY(0deg)'}],{duration:240,easing:'ease-out'});}).finally(()=>{turning=false;});}
  root.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>{book=books.find(b=>b.id===button.dataset.book);spread=0;trigger=button;paint();dialog.showModal();canvas.focus();}));
  prev.addEventListener('click',()=>turn(-1));next.addEventListener('click',()=>turn(1));canvas.addEventListener('click',event=>{const leaf=event.target.closest('[data-turn]');if(leaf)turn(Number(leaf.dataset.turn));});dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();turn(event.key==='ArrowRight'?1:-1);}});dialog.querySelector('.reader-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{turning=false;trigger?.focus();});
 }
 const filmDialog=root.querySelector('.film-dialog');
 if(filmDialog){const video=filmDialog.querySelector('video'),trigger=root.querySelector('.film-frame');trigger.addEventListener('click',()=>{filmDialog.showModal();if(film.src)video.play().catch(()=>{});});filmDialog.querySelector('.reader-close').addEventListener('click',()=>filmDialog.close());filmDialog.addEventListener('close',()=>{video.pause();trigger.focus();});video.addEventListener('error',()=>{const message=filmDialog.querySelector('.video-pending');message.hidden=false;message.textContent=t('视频暂时无法播放','Video unavailable');});}
}


