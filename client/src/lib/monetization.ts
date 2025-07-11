// ProtoLab monetization with RevenueCat integration
import { apiRequest } from './queryClient';

interface PricingOffer {
  id: string;
  name: string;
  price: string;
  localPrice: string;
  description: string;
  features: string[];
  isFeatured: boolean;
  region: string;
  isSpecial: boolean;
}

interface CreditStatus {
  openai_remaining: number;
  openai_total: number;
  deepseek_remaining: number;
  deepseek_total: number;
  document_generations: number;
  website_analyses: number;
}

class ProtoLabMonetization {
  private initialized: boolean = false;
  private userTier: string = 'free';

  async initialize() {
    try {
      // Check user subscription status
      const response = await apiRequest('GET', '/api/user/subscription');
      const data = await response.json();
      
      this.userTier = data.tier || 'free';
      this.initialized = true;
      
      this.setupUI();
      this.updateCreditStatus();
      
      console.log('ProtoLab monetization initialized');
      
    } catch (error) {
      console.error('Monetization initialization failed:', error);
      this.setupFallbackUI();
    }
  }

  getPricingOffers(): PricingOffer[] {
    // ProtoLab pricing plans with generous free tier for user acquisition
    return [
      {
        id: 'free',
        name: 'Free Tier',
        price: '$0',
        localPrice: '0 KES',
        description: 'Perfect for getting started',
        features: [
          '5 AI pitch generations',
          '3 document uploads',
          '2 website analyses',
          '1 3D video preview',
          'Basic templates',
          'Community support'
        ],
        isFeatured: false,
        region: 'global',
        isSpecial: false
      },
      {
        id: 'hustler_plus',
        name: 'Hustler Plus',
        price: '$14.99',
        localPrice: '1500 KES',
        description: 'Perfect for African entrepreneurs',
        features: [
          '50 AI document generations',
          '10 3D video generations',
          'M-Pesa payment support',
          'African industry templates',
          'PDF & PowerPoint export',
          'Advanced document intelligence'
        ],
        isFeatured: false,
        region: 'africa',
        isSpecial: true
      },
      {
        id: 'founder',
        name: 'Founder',
        price: '$29.99',
        localPrice: '3000 KES',
        description: 'Complete business toolkit',
        features: [
          '200 AI generations per month',
          'Advanced document intelligence',
          'Website brand analysis',
          'AI video presentations',
          'Priority support',
          'Collaboration workspace',
          'Export to all formats'
        ],
        isFeatured: true,
        region: 'global',
        isSpecial: true
      },
      {
        id: 'corporate',
        name: 'Corporate',
        price: '$69.99',
        localPrice: '7000 KES',
        description: 'For teams and enterprises',
        features: [
          '500 AI generations per month',
          'RFP proposal generation',
          'Team management',
          'White-label options',
          'API access',
          'Custom integrations',
          'Advanced analytics',
          'Priority processing'
        ],
        isFeatured: false,
        region: 'global',
        isSpecial: true
      }
    ];
  }

  setupUI() {
    const container = document.getElementById('bolt-monetization');
    if (!container) return;

    const offers = this.getPricingOffers();
    
    container.innerHTML = `
      <div class="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        ${offers.map(offer => this.createOfferCard(offer)).join('')}
      </div>
      
      <div class="proto-credit-status bg-slate-50 rounded-lg p-6">
        <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span class="text-purple-600">⚡</span>
          Proto Credit Status
        </h4>
        <div id="credit-meters" class="space-y-3"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  createOfferCard(offer: PricingOffer): string {
    return `
      <div class="pricing-card ${offer.isFeatured ? 'featured-promo' : ''} bg-white rounded-lg border-2 ${offer.isFeatured ? 'border-purple-500' : 'border-slate-200'} p-6 relative" data-offer-id="${offer.id}">
        ${offer.isSpecial ? '<div class="special-badge absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">ProtoLab Special</div>' : ''}
        
        <h3 class="text-xl font-bold text-slate-900 mb-2">${offer.name}</h3>
        
        <div class="price-display mb-4">
          <span class="global-price text-3xl font-bold text-slate-900">${offer.price}</span>
          ${offer.region === 'africa' ? `<div class="local-price text-sm text-slate-600 mt-1">${offer.localPrice} via M-Pesa</div>` : ''}
        </div>
        
        <p class="description text-slate-600 mb-4">${offer.description}</p>
        
        <ul class="features space-y-2 mb-6">
          ${offer.features.map(feature => `
            <li class="flex items-center gap-2 text-sm text-slate-700">
              <span class="text-green-500">✓</span>
              ${feature}
            </li>
          `).join('')}
        </ul>
        
        <button class="purchase-btn w-full bg-gradient-to-r ${offer.isFeatured ? 'from-purple-600 to-blue-600' : 'from-slate-600 to-slate-700'} text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity" data-offer-id="${offer.id}">
          Choose Plan
        </button>
      </div>
    `;
  }

  setupFallbackUI() {
    const container = document.getElementById('bolt-monetization');
    if (!container) return;

    container.innerHTML = `
      <div class="pricing-fallback bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 text-center">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Upgrade to ProtoLab Pro</h3>
        <p class="text-slate-600 mb-6">Unlock advanced AI features, unlimited generations, and document intelligence</p>
        <button class="upgrade-btn bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          View Plans
        </button>
      </div>
    `;
  }

  async purchaseOffer(offerId: string) {
    try {
      // Show loading state
      this.showPurchaseLoading(offerId);

      // Process purchase through backend
      const response = await apiRequest('POST', '/api/subscription/purchase', {
        planId: offerId,
        source: 'bolt_hackathon'
      });

      const result = await response.json();

      if (result.success) {
        this.showPurchaseSuccess(offerId);
        this.updateUserAccess(result.tier);
      } else {
        throw new Error(result.error || 'Purchase failed');
      }

    } catch (error) {
      console.error('Purchase failed:', error);
      this.showPurchaseError(error.message);
    }
  }

  showPurchaseLoading(offerId: string) {
    const button = document.querySelector(`[data-offer-id="${offerId}"] .purchase-btn`) as HTMLButtonElement;
    if (button) {
      button.innerHTML = 'Processing...';
      button.disabled = true;
    }
  }

  showPurchaseSuccess(offerId: string) {
    const card = document.querySelector(`[data-offer-id="${offerId}"]`);
    if (card) {
      card.classList.add('purchased');
      const button = card.querySelector('.purchase-btn') as HTMLButtonElement;
      button.innerHTML = 'Active';
      button.disabled = true;
      button.classList.add('bg-green-600');
    }

    this.showNotification('Purchase successful! Welcome to ProtoLab Pro!', 'success');
  }

  showPurchaseError(message: string) {
    this.showNotification(`Purchase failed: ${message}`, 'error');
    
    // Reset buttons
    document.querySelectorAll('.purchase-btn').forEach((btn: HTMLButtonElement) => {
      btn.innerHTML = 'Choose Plan';
      btn.disabled = false;
    });
  }

  async updateCreditStatus() {
    try {
      const response = await apiRequest('GET', '/api/user/credits');
      const credits: CreditStatus = await response.json();
      
      const meter = document.getElementById('credit-meters');
      if (meter) {
        meter.innerHTML = `
          <div class="credit-item">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-slate-700">OpenAI Credits</span>
              <span class="text-sm text-slate-600">${credits.openai_remaining}/${credits.openai_total}</span>
            </div>
            <div class="credit-bar bg-slate-200 rounded-full h-2">
              <div class="credit-fill bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300" style="width: ${(credits.openai_remaining / credits.openai_total) * 100}%"></div>
            </div>
          </div>
          
          <div class="credit-item">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-slate-700">Document Generations</span>
              <span class="text-sm text-slate-600">${credits.document_generations} this month</span>
            </div>
            <div class="credit-bar bg-slate-200 rounded-full h-2">
              <div class="credit-fill bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" style="width: ${Math.min((credits.document_generations / 50) * 100, 100)}%"></div>
            </div>
          </div>
          
          <div class="credit-item">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-slate-700">Website Analyses</span>
              <span class="text-sm text-slate-600">${credits.website_analyses} this month</span>
            </div>
            <div class="credit-bar bg-slate-200 rounded-full h-2">
              <div class="credit-fill bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" style="width: ${Math.min((credits.website_analyses / 20) * 100, 100)}%"></div>
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.error('Failed to update credit status:', error);
    }
  }

  updateUserAccess(tier: string) {
    this.userTier = tier;
    
    // Update UI based on user's tier
    if (tier !== 'free') {
      document.body.classList.add('protolab-pro');
      
      // Enable pro features
      const proFeatures = document.querySelectorAll('.pro-feature');
      proFeatures.forEach(feature => feature.classList.remove('locked'));
      
      // Update navigation
      const upgradeButtons = document.querySelectorAll('.upgrade-btn');
      upgradeButtons.forEach(btn => {
        btn.textContent = 'Pro Active';
        (btn as HTMLButtonElement).disabled = true;
      });
    }
  }

  showNotification(message: string, type: 'success' | 'error') {
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  attachEventListeners() {
    // Handle purchase button clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('purchase-btn')) {
        const offerId = target.getAttribute('data-offer-id');
        if (offerId) {
          this.purchaseOffer(offerId);
        }
      }
      
      if (target.classList.contains('upgrade-btn')) {
        this.showUpgradeModal();
      }
    });

    // Handle region detection for pricing
    this.detectUserRegion();
  }

  showUpgradeModal() {
    const modal = document.createElement('div');
    modal.className = 'upgrade-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="modal-content bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">Upgrade to ProtoLab Pro</h2>
        <p class="text-slate-600 mb-6">Unlock advanced AI document generation and African market features</p>
        <div class="upgrade-options space-y-3">
          <button class="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white py-3 px-4 rounded-lg font-semibold" data-plan="hustler_plus_bolt">
            Hustler Plus - $4.99/month
          </button>
          <button class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold" data-plan="founder_bolt">
            Founder - $19.99/month
          </button>
          <button class="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white py-3 px-4 rounded-lg font-semibold" data-plan="corporate_bolt">
            Corporate - $49.99/month
          </button>
        </div>
        <button class="close-modal w-full mt-4 text-slate-600 hover:text-slate-800">Close</button>
      </div>
    `;
    
    // Handle modal clicks
    modal.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('close-modal') || target === modal) {
        modal.remove();
      }
      
      if (target.hasAttribute('data-plan')) {
        const plan = target.getAttribute('data-plan');
        if (plan) {
          modal.remove();
          this.purchaseOffer(plan);
        }
      }
    });
    
    document.body.appendChild(modal);
  }

  detectUserRegion() {
    // Detect user region for localized pricing
    const language = navigator.language;
    if (language?.includes('sw') || language?.includes('af') || language?.includes('zu')) {
      document.body.classList.add('region-africa');
    }
  }

  getUserTier(): string {
    return this.userTier;
  }

  isProUser(): boolean {
    return this.userTier !== 'free';
  }
}

// Export the monetization system
export const monetization = new ProtoLabMonetization();

// Auto-initialize
if (typeof window !== 'undefined') {
  monetization.initialize();
}