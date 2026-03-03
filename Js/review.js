window.App = window.App || {};

document.addEventListener('DOMContentLoaded', () => {
	const reviewsList = document.getElementById('reviewsList');
	const filterButtons = document.querySelectorAll('.filter-btn');
	const importedCountEl = document.getElementById('importedCount');

	if (!reviewsList) return;

	const reviews = [
		{ author: 'AlluringEntree9', rating: 5, product: 'YouTube + Spotify + Discord Nitro', date: '2024-02-13', text: 'Bought 1 year plans and delivery was instant. Huge vouch.', verified: true, source: 'Discord vouch export' },
		{ author: 'Yumi', rating: 5, product: 'Brawl Gold Pass', date: '2024-03-01', text: 'Gold pass delivered and worked as expected.', verified: true, source: 'Discord vouch export' },
		{ author: 'Muuuun', rating: 5, product: 'Spotify Premium', date: '2024-04-07', text: 'Spotify premium delivered with no issues.', verified: true, source: 'Discord vouch export' },
		{ author: 'danielux', rating: 5, product: 'Spotify Family', date: '2024-04-16', text: 'Spotify Family bought and everything worked.', verified: true, source: 'Discord vouch export' },
		{ author: 'VLN', rating: 5, product: 'Spotify Premium 1 Year', date: '2024-05-17', text: 'Received 1 year Spotify Premium as requested.', verified: true, source: 'Discord vouch export' },
		{ author: 'WarGoat', rating: 4, product: 'PayPal to Crypto Exchange', date: '2024-01-28', text: 'PayPal to crypto exchange was fast and easy.', verified: true, source: 'Discord vouch export' },
		{ author: 'krystlkstls', rating: 5, product: 'Steam Region Change', date: '2024-01-15', text: 'Fastest region change I have had.', verified: true, source: 'Discord vouch export' },
		{ author: 'AJ_OP', rating: 4, product: 'PayPal to Crypto Exchange', date: '2024-02-22', text: 'Used exchange service for $50 and it was smooth.', verified: true, source: 'Discord vouch export' },
		{ author: 'Milan K.', rating: 5, product: 'Netflix Premium', date: '2026-02-24', text: 'Received access in around 6 minutes. Smooth process and clear instructions.', verified: true },
		{ author: 'Chloe B.', rating: 4, product: 'Spotify Premium', date: '2026-02-05', text: 'Worked fine after setup, but I had to message support once for region steps.', verified: true },
		{ author: 'Aaron T.', rating: 5, product: 'Discord Nitro', date: '2026-01-18', text: 'Nitro delivered quickly and activated first try. Good value.', verified: true },
		{ author: 'Lena P.', rating: 3, product: 'Netflix Premium', date: '2025-12-30', text: 'Account works, but delivery took closer to 20 minutes than expected.', verified: true },
		{ author: 'Jonas R.', rating: 5, product: 'YouTube Premium', date: '2025-11-16', text: 'Got the family plan and it has been stable so far.', verified: true },
		{ author: 'Fatima D.', rating: 5, product: 'Discord Server Boost', date: '2025-10-03', text: 'Server boosts were applied the same day. Support answered quickly.', verified: true },
		{ author: 'Mia L.', rating: 4, product: 'Netflix Premium', date: '2025-09-12', text: 'Good overall. Checkout was easy, but first email landed in spam.', verified: true },
		{ author: 'Kacper N.', rating: 5, product: 'Spotify Premium', date: '2025-08-27', text: 'Second purchase this year and both went through without issues.', verified: true },
		{ author: 'Owen H.', rating: 5, product: 'Discord Nitro', date: '2025-08-01', text: 'Activation worked right away. Price was much lower than direct.', verified: true },
		{ author: 'Ari S.', rating: 2, product: 'Netflix Premium', date: '2025-07-19', text: 'My first account stopped after a day, but replacement was issued later.', verified: true },
		{ author: 'Nora V.', rating: 5, product: 'Telegram Premium', date: '2025-06-02', text: 'Simple process, no confusion. Would buy again.', verified: true },
		{ author: 'Elias G.', rating: 4, product: 'Spotify Premium', date: '2025-05-13', text: 'Great pricing. Setup guide could be a bit clearer for new users.', verified: true },
		{ author: 'Diana M.', rating: 5, product: 'Discord Nitro', date: '2025-04-08', text: 'Fast and exactly as described. No hidden surprises.', verified: true },
		{ author: 'Victor C.', rating: 5, product: 'Netflix Premium', date: '2025-03-02', text: 'Used for three months now and still working.', verified: true },
		{ author: 'Sara E.', rating: 5, product: 'Spotify Premium', date: '2025-01-25', text: 'Saved a lot compared to monthly direct billing.', verified: true },
		{ author: 'Mark P.', rating: 3, product: 'Discord Nitro', date: '2024-12-04', text: 'Valid product, but I expected faster first response from support.', verified: true },
		{ author: 'Ines A.', rating: 5, product: 'Netflix Premium', date: '2024-10-14', text: 'Bought for my family account and it has stayed active.', verified: true },
		{ author: 'Tom W.', rating: 5, product: 'YouTube Premium', date: '2024-09-09', text: 'Delivery was under 10 minutes. Easy from phone too.', verified: true },
		{ author: 'Luca F.', rating: 4, product: 'Discord Server Boost', date: '2024-08-22', text: 'Boost quantity was correct, one short delay but resolved.', verified: true },
		{ author: 'Hana Z.', rating: 5, product: 'Spotify Premium', date: '2024-07-18', text: 'No issues on renewal. Checkout was straightforward.', verified: true },
	];

	let activeFilter = 'all';

	if (importedCountEl) {
		const importedCount = reviews.filter(review => !!review.source).length;
		importedCountEl.textContent = String(importedCount);
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getStars(rating) {
		return '★'.repeat(rating) + '☆'.repeat(5 - rating);
	}

	function escapeHtml(value) {
		return String(value || '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function matchesFilter(review, filter) {
		if (filter === 'all') return true;
		if (filter === '5' || filter === '4') return review.rating === Number(filter);
		if (filter === 'discord-import') return !!review.source;
		return review.product.toLowerCase().includes(filter);
	}

	function renderReviews() {
		const filtered = reviews
			.filter(review => matchesFilter(review, activeFilter))
			.sort((a, b) => new Date(b.date) - new Date(a.date));

		reviewsList.innerHTML = filtered.map(review => `
			<article class="review-box">
				<div class="review-header">
					<div class="review-author-wrap">
						<div class="review-author">${escapeHtml(review.author)}</div>
						<div class="review-meta-row">
							<span class="verified-badge">✔ Verified Purchase</span>
							<span class="review-product">🛒 Bought: ${escapeHtml(review.product)}</span>
							${review.source ? `<span class="source-badge">📑 ${escapeHtml(review.source)}</span>` : ''}
						</div>
					</div>
					<div class="review-date">${formatDate(review.date)}</div>
				</div>
				<div class="review-stars">${getStars(review.rating)}</div>
				<p class="review-text">${escapeHtml(review.text)}</p>
			</article>
		`).join('');

		if (!filtered.length) {
			reviewsList.innerHTML = '<div class="review-empty">No reviews match this filter yet.</div>';
		}
	}

	filterButtons.forEach(button => {
		button.addEventListener('click', () => {
			activeFilter = button.dataset.filter || 'all';
			filterButtons.forEach(btn => btn.classList.remove('is-active'));
			button.classList.add('is-active');
			renderReviews();
		});
	});

	renderReviews();
});
