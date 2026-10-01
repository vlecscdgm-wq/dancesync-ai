const photo=document.getElementById("photo"), dance=document.getElementById("dance");
const photoPreview=document.getElementById("photoPreview"), dancePreview=document.getElementById("dancePreview");
const statusEl=document.getElementById("status"), generate=document.getElementById("generate");
const motion=document.getElementById("motion"), motionValue=document.getElementById("motionValue");

photo.onchange=()=>{const f=photo.files[0]; if(!f)return; photoPreview.innerHTML=`<img src="${URL.createObjectURL(f)}">`; document.getElementById("photoText").textContent=f.name; check()};
dance.onchange=()=>{const f=dance.files[0]; if(!f)return; dancePreview.innerHTML=`<video src="${URL.createObjectURL(f)}" controls></video>`; document.getElementById("danceText").textContent=f.name; check()};
motion.oninput=()=>motionValue.textContent=motion.value+"%";
document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
function check(){generate.disabled=!(photo.files[0]&&dance.files[0]);statusEl.textContent=generate.disabled?"Upload both files to begin.":"Ready — press Generate Dance Video."}
generate.onclick=async()=>{
  generate.disabled=true; statusEl.textContent="Preparing your photo and choreography…";
  const form=new FormData(); form.append("photo",photo.files[0]); form.append("dance_video",dance.files[0]);
  form.append("motion_strength",motion.value);
  form.append("video_length",document.querySelector(".chip.active").dataset.value);
  try{
    const r=await fetch("http://localhost:8000/generate",{method:"POST",body:form});
    if(!r.ok) throw new Error("Backend not configured");
    const data=await r.json(); statusEl.textContent=data.message||"Generation started.";
  }catch(e){
    statusEl.textContent="Frontend ready. Connect your motion-transfer AI API to /generate.";
  }finally{generate.disabled=false}
}; check();