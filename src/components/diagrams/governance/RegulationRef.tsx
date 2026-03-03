/**
 * RegulationRef - Inline regulation reference tooltip (DIAG-06)
 *
 * 100% span-based component for use inside MDX <p> tags.
 * Self-contained popover (no DiagramTooltip) to avoid div wrappers
 * that would break inline HTML validity.
 *
 * Exports:
 * - RegulationRef: Inline tooltip showing regulation article, title, and lastVerified date
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { colors } from '@primitives/shared';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

export interface RegulationRefProps {
  /** Regulation identifier (e.g., "GDPR", "152-FZ") */
  regulation: string;
  /** Article number (e.g., "17", "9") */
  article: string;
  /** Human-readable article title (e.g., "Right to Erasure") */
  title: string;
  /** Last verified date in YYYY-MM format (e.g., "2026-03") */
  lastVerified: string;
}

/* ================================================================== */
/*  RegulationRef                                                      */
/* ================================================================== */

/**
 * RegulationRef
 *
 * Renders an inline span trigger that shows a glass-styled popover with
 * regulation details on hover/click. Every rendered element is a <span>
 * to ensure valid inline HTML when used inside MDX paragraph tags.
 */
export function RegulationRef({
  regulation,
  article,
  title,
  lastVerified,
}: RegulationRefProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLSpanElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    const padding = 16;
    const offset = 8;

    let top = rect.top - offset;
    let left = rect.left + rect.width / 2 - popoverWidth / 2;

    // Keep within viewport horizontally
    left = Math.max(padding, Math.min(left, window.innerWidth - popoverWidth - padding));

    setPosition({ top, left });
  }, []);

  // Update position when opening
  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  // Close on click outside, Escape, scroll, resize
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    const handleScroll = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      {/* Trigger */}
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        style={{
          color: colors.warning,
          cursor: 'pointer',
          borderBottom: `1px dashed ${colors.warning}99`,
          fontSize: 'inherit',
          fontFamily: 'inherit',
        }}
      >
        {regulation} Art.&nbsp;{article}
      </span>

      {/* Portal popover (span-based) */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            ref={popoverRef}
            role="tooltip"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              display: 'block',
              top: position.top,
              left: position.left,
              transform: 'translateY(-100%)',
              width: 280,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 10,
              padding: '10px 14px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              zIndex: 9999,
              pointerEvents: 'auto',
            }}
          >
            {/* Header */}
            <span
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: colors.warning,
                marginBottom: 4,
              }}
            >
              {regulation}, Article {article}
            </span>

            {/* Title */}
            <span
              style={{
                display: 'block',
                fontSize: 13,
                color: colors.text,
                lineHeight: 1.4,
                marginBottom: 6,
              }}
            >
              {title}
            </span>

            {/* Footer */}
            <span
              style={{
                display: 'block',
                fontSize: 11,
                fontFamily: 'monospace',
                color: colors.textMuted,
              }}
            >
              Last verified: {lastVerified}
            </span>
          </span>,
          document.body,
        )}
    </span>
  );
}
