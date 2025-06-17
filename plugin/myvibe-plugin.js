(function(){
class MyVibePlugin {
    constructor(options={}){
        this.apiBase = options.apiBase || 'http://localhost:3000/api';
        this.container = options.container || this.createContainer();
        this.init();
    }

    createContainer(){
        const container = document.createElement('div');
        container.id = 'myvibe-widget-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.width = '300px';
        container.style.background = '#fff';
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '6px';
        container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }

    async init(){
        const reg = this.getRegistration();
        if(reg){
            this.renderSentimentButtons();
        } else {
            this.renderRegistrationForms();
        }
    }

    getRegistration(){
        try{
            return JSON.parse(localStorage.getItem('myvibeRegistration'));
        }catch(e){
            return null;
        }
    }

    saveRegistration(reg){
        localStorage.setItem('myvibeRegistration', JSON.stringify(reg));
    }

    renderRegistrationForms(){
        this.container.innerHTML = `
            <div style="display:flex;border-bottom:1px solid #eee;">
                <button id="mv-tab-register" style="flex:1;padding:8px;border:none;background:none;cursor:pointer;border-bottom:2px solid #4CAF50;">Register</button>
                <button id="mv-tab-login" style="flex:1;padding:8px;border:none;background:none;cursor:pointer;">Login</button>
            </div>
            <div id="mv-register" style="padding:12px;">
                <form id="mv-register-form">
                    <input id="mv-handle" type="text" placeholder="Your handle" required style="width:100%;margin-bottom:8px;" />
                    <input id="mv-company" type="text" placeholder="Company name" required style="width:100%;margin-bottom:8px;" />
                    <button type="submit" style="width:100%;padding:8px;background:#4CAF50;color:#fff;border:none;cursor:pointer;">Register</button>
                </form>
            </div>
            <div id="mv-login" style="padding:12px;display:none;">
                <form id="mv-login-form">
                    <input id="mv-login-handle" type="text" placeholder="Enter your handle" required style="width:100%;margin-bottom:8px;" />
                    <button type="submit" style="width:100%;padding:8px;background:#4CAF50;color:#fff;border:none;cursor:pointer;">Login</button>
                </form>
            </div>`;

        document.getElementById('mv-tab-register').addEventListener('click',()=>{
            document.getElementById('mv-tab-register').style.borderBottom = '2px solid #4CAF50';
            document.getElementById('mv-tab-login').style.borderBottom = 'none';
            document.getElementById('mv-register').style.display='block';
            document.getElementById('mv-login').style.display='none';
        });
        document.getElementById('mv-tab-login').addEventListener('click',()=>{
            document.getElementById('mv-tab-login').style.borderBottom = '2px solid #4CAF50';
            document.getElementById('mv-tab-register').style.borderBottom = 'none';
            document.getElementById('mv-register').style.display='none';
            document.getElementById('mv-login').style.display='block';
        });

        document.getElementById('mv-register-form').addEventListener('submit', async (e)=>{
            e.preventDefault();
            const handle = document.getElementById('mv-handle').value;
            const company = document.getElementById('mv-company').value;
            try{
                const res = await fetch(`${this.apiBase}/register`, {
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({handle, company})
                });
                const data = await res.json();
                if(!res.ok) throw new Error(data.error || 'Registration failed');
                this.saveRegistration({handleId:data.handleId, company});
                this.renderSentimentButtons();
            }catch(err){
                alert('Registration failed: '+err.message);
            }
        });

        document.getElementById('mv-login-form').addEventListener('submit', async (e)=>{
            e.preventDefault();
            const handle = document.getElementById('mv-login-handle').value;
            try{
                const res = await fetch(`${this.apiBase}/login`, {
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({handle})
                });
                const data = await res.json();
                if(!res.ok) throw new Error(data.error || 'Login failed');
                this.saveRegistration({handleId:data.handleId, company:data.company});
                this.renderSentimentButtons();
            }catch(err){
                alert('Login failed: '+err.message);
            }
        });
    }

    renderSentimentButtons(){
        this.container.innerHTML = `
            <div style="padding:12px;text-align:center;">
                <h3 style="margin-top:0;margin-bottom:12px;">How's your vibe?</h3>
                <button class="mv-sent" data-sent="GREAT" style="display:block;width:100%;margin-bottom:8px;padding:8px;background:#4CAF50;color:#fff;border:none;cursor:pointer;">😊 Great</button>
                <button class="mv-sent" data-sent="MEH" style="display:block;width:100%;margin-bottom:8px;padding:8px;background:#FFC107;color:#000;border:none;cursor:pointer;">😐 Meh</button>
                <button class="mv-sent" data-sent="UGH" style="display:block;width:100%;padding:8px;background:#F44336;color:#fff;border:none;cursor:pointer;">😫 Ugh</button>
            </div>`;

        Array.from(this.container.querySelectorAll('.mv-sent')).forEach(btn=>{
            btn.addEventListener('click', ()=>this.sendSentiment(btn.getAttribute('data-sent')));
        });
    }

    async sendSentiment(sentiment){
        const reg = this.getRegistration();
        if(!reg){
            alert('Not registered');
            return;
        }
        try{
            const res = await fetch(`${this.apiBase}/sentiment`, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({handleId: reg.handleId, sentiment})
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.error || 'Failed to send');
            this.showFeedback(sentiment);
        }catch(err){
            alert('Failed to send sentiment: '+err.message);
        }
    }

    showFeedback(sent){
        const btn = this.container.querySelector(`.mv-sent[data-sent="${sent}"]`);
        if(!btn) return;
        const original = btn.textContent;
        btn.textContent = 'Sent! \uD83D\uDC4D';
        setTimeout(()=>{btn.textContent = original;},2000);
    }
}

window.MyVibePlugin = MyVibePlugin;
})();
