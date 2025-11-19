document.addEventListener('DOMContentLoaded', function() {
	const cartCountDisplay = document.getElementById('cartCount');
	const sidebarPriceDisplay = document.getElementById('sidebarPrice');
	const cartTotalDisplay = document.getElementById('cartTotal');
	const sidebarCartItemsContainer = document.getElementById('sidebarCartItems');
	const addMoneyInput = document.getElementById('addMoneyInput');
	const addMoneyBtn = document.getElementById('addMoneyBtn');
	const buyNowBtns = document.querySelectorAll('.buyNow');

	const mainCartList = document.getElementById('mainCartList');
	const emptyCartMessage = document.getElementById('emptyCartMessage');
	const summarySubtotal = document.getElementById('summarySubtotal');


	let walletBalance = parseFloat(localStorage.getItem('walletBalance')) || 500;
	let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];


	function saveState() {
		localStorage.setItem('walletBalance', walletBalance.toFixed(2));
		localStorage.setItem('cartItems', JSON.stringify(cartItems));
	}


	function updateWalletDisplay() {
		if (sidebarPriceDisplay) sidebarPriceDisplay.innerText = `₱${walletBalance.toFixed(2)}`;
	}


	function updateCartDisplay() {
		let total = 0;
		let totalCount = 0;


		if (sidebarCartItemsContainer) sidebarCartItemsContainer.innerHTML = '';


		cartItems.forEach(item => {
			const itemTotal = item.price * item.quantity;
			total += itemTotal;
			totalCount += item.quantity;


			if (sidebarCartItemsContainer) {
				const itemEl = document.createElement('div');
				itemEl.className = 'cart-item-summary';
				itemEl.innerHTML = `<p>${item.name} x ${item.quantity} <span style="float: right;">₱${itemTotal.toFixed(2)}</span></p>`;
				sidebarCartItemsContainer.appendChild(itemEl);
			}
		});


		if (cartCountDisplay) cartCountDisplay.innerText = totalCount;
		if (cartTotalDisplay) cartTotalDisplay.innerText = `Total: ₱${total.toFixed(2)}`;


		if (mainCartList) {
			renderMainCartList(cartItems);
			if (summarySubtotal) summarySubtotal.innerText = `₱${total.toFixed(2)}`;

			if (cartItems.length === 0) {
				mainCartList.style.display = 'none';
				if (emptyCartMessage) emptyCartMessage.style.display = 'block';
			} else {
				mainCartList.style.display = 'flex';
				if (emptyCartMessage) emptyCartMessage.style.display = 'none';
			}
		}
	}


	function renderMainCartList(items) {
		mainCartList.innerHTML = '';
		items.forEach((item, index) => {
			const div = document.createElement('div');
			div.className = 'cart-page-item';
			div.innerHTML = `
                <div class="cart-item-info-group">
                    <img src="images/coffee.png" class="cart-item-img" alt="Product">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <span class="cart-item-price">₱${item.price}</span>
                    </div>
                </div>
                <div class="cart-controls">
                    <div class="qty-group">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
			mainCartList.appendChild(div);
		});


		document.querySelectorAll('.qty-btn.minus').forEach(btn => {
			btn.addEventListener('click', (e) => changeQty(e.target.dataset.index, -1));
		});
		document.querySelectorAll('.qty-btn.plus').forEach(btn => {
			btn.addEventListener('click', (e) => changeQty(e.target.dataset.index, 1));
		});
		document.querySelectorAll('.remove-btn').forEach(btn => {
			const index = btn.dataset.index || btn.closest('.remove-btn').dataset.index;
			btn.addEventListener('click', () => removeItem(index));
		});
	}


	function changeQty(index, change) {
		if (cartItems[index]) {
			cartItems[index].quantity += change;
			if (cartItems[index].quantity < 1) cartItems[index].quantity = 1;
			saveState();
			updateCartDisplay();
		}
	}


	function removeItem(index) {
		cartItems.splice(index, 1);
		saveState();
		updateCartDisplay();
	}


	if (addMoneyBtn) {
		addMoneyBtn.addEventListener('click', function() {
			const amount = parseFloat(addMoneyInput.value);
			if (amount && amount > 0) {
				walletBalance += amount;
				addMoneyInput.value = '';
				saveState();
				updateWalletDisplay();
				alert(`₱${amount.toFixed(2)} added!`);
			}
		});
	}


	buyNowBtns.forEach(btn => {
		btn.addEventListener('click', function() {
			let total = 0;
			cartItems.forEach(item => {
				total += item.price * item.quantity;
			});
			if (cartItems.length === 0) return alert('Cart is empty!');
			if (walletBalance >= total) {
				walletBalance -= total;
				cartItems = [];
				saveState();
				updateWalletDisplay();
				updateCartDisplay();
				alert(`Purchase successful!`);
			} else {
				alert(`Insufficient funds. Needed: ₱${(total - walletBalance).toFixed(2)}`);
			}
		});
	});


	const filterBtns = document.querySelectorAll('.filter-pill');
	const productCards = document.querySelectorAll('.coffee-card');
	const sortSelect = document.getElementById('sortSelect');
	const productGrid = document.getElementById('coffeeGrid') || document.getElementById('flowerGrid');


	const seasonalBtn = document.getElementById('seasonal-btn');
	const comboBtn = document.getElementById('combo-btn');
	const seasonalContent = document.getElementById('seasonal-content');
	const comboContent = document.getElementById('combo-content');
	const specialSeasonal = document.getElementById('special-seasonal-card');
	const specialCombo = document.getElementById('special-combo-card');


	if (seasonalBtn && comboBtn) {
		seasonalBtn.addEventListener('click', () => {
			seasonalBtn.classList.add('active');
			comboBtn.classList.remove('active');
			seasonalContent.style.display = 'block';
			comboContent.style.display = 'none';
			specialSeasonal.style.display = 'flex';
			specialCombo.style.display = 'none';
		});
		comboBtn.addEventListener('click', () => {
			comboBtn.classList.add('active');
			seasonalBtn.classList.remove('active');
			comboContent.style.display = 'block';
			seasonalContent.style.display = 'none';
			specialCombo.style.display = 'flex';
			specialSeasonal.style.display = 'none';
		});
	}


	filterBtns.forEach(btn => {
		if (btn.id === 'seasonal-btn' || btn.id === 'combo-btn') return;
		btn.addEventListener('click', () => {
			filterBtns.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			const filter = btn.getAttribute('data-filter');
			productCards.forEach(card => {
				const category = card.getAttribute('data-category');
				if (filter === 'all' || filter === category) card.style.display = 'flex';
				else card.style.display = 'none';
			});
		});
	});


	if (sortSelect && productGrid) {
		sortSelect.addEventListener('change', function() {
			const sortValue = this.value;
			const cardsArray = Array.from(productCards);
			cardsArray.sort((a, b) => {
				const pA = parseFloat(a.getAttribute('data-price'));
				const pB = parseFloat(b.getAttribute('data-price'));
				if (sortValue === 'price-low') return pA - pB;
				if (sortValue === 'price-high') return pB - pA;
			});
			cardsArray.forEach(card => productGrid.appendChild(card));
		});
	}


	updateWalletDisplay();
	updateCartDisplay();
});
document.addEventListener('DOMContentLoaded', () => {
    const ptEl = document.getElementById('pointsTotal');
    if (!ptEl) return;

    const readPts = () => parseInt(ptEl.textContent.replace(/[^0-9]/g,'')) || 0;
    const writePts = v => { ptEl.textContent = v.toLocaleString(); };

    document.querySelectorAll('[data-redeem]').forEach(btn => {
        btn.addEventListener('click', () => {
    const costMap = { upgrade:150, latte:600, bundle:1400 };
    const key = btn.dataset.redeem;

    const cost = costMap[key] || 0;
    const cur = readPts();

    if (cur < cost) { alert('Not enough points for this reward.'); return; }
        writePts(cur - cost);
        alert('Redeemed! You used ' + cost + ' points for the ' + key + ' reward.');
        });
    });
});


function addToCart(name, price) {
	let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
	const existing = cart.find(i => i.name === name);
	if (existing) existing.quantity++;
	else cart.push({
		id: Date.now(),
		name: name,
		price: price,
		quantity: 1
	});
	localStorage.setItem('cartItems', JSON.stringify(cart));
	window.location.reload();
}

