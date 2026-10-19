/**
 * Utilitário centralizado de rastreamento de eventos (Meta Pixel e DataLayer / GTM)
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    dataLayer?: Array<Record<string, any>>;
  }
}

export interface LeadTrackingParams {
  content_name?: string;
  currency?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Dispara o evento oficial padrão "Lead" para o Meta Pixel e dataLayer (GTM / GA4)
 */
export function trackLead(params?: LeadTrackingParams): void {
  try {
    if (typeof window === 'undefined') return;

    const payload = {
      content_name: params?.content_name || 'Lead Nortyn',
      currency: params?.currency || 'BRL',
      value: params?.value ?? 0,
      ...params,
    };

    // 1. Meta Pixel (Facebook)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', payload);
      console.log('[Analytics] Meta Pixel Lead disparado:', payload);
    } else {
      console.warn('[Analytics] Meta Pixel (fbq) não encontrado no window.');
    }

    // 2. DataLayer (Google Tag Manager / GA4)
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'lead',
        ...payload,
      });
      console.log('[Analytics] dataLayer lead disparado:', payload);
    }
  } catch (error) {
    console.error('[Analytics] Erro ao disparar evento de Lead:', error);
  }
}

/**
 * Dispara um evento personalizado ou padrão genérico no Pixel / dataLayer
 */
export function trackCustomEvent(eventName: string, params?: Record<string, any>): void {
  try {
    if (typeof window === 'undefined') return;

    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, params || {});
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...(params || {}),
      });
    }
  } catch (error) {
    console.error(`[Analytics] Erro ao disparar evento ${eventName}:`, error);
  }
}
