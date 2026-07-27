// @ts-nocheck
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, ChevronDown, ChevronRight, ExternalLink, Menu,
  Home, Building2, Globe, Music,
  UsersRound, GraduationCap, Crown, LogIn, LogOut,
  ClipboardList, BookOpen, Tv2, FileText, AlertCircle,
  MessageSquare, Coins, Folder, Book, UserPlus, Info
} from 'lucide-react';

import { getApiUrl, getImageUrl } from '../../config/environment';
import { headerNavGroups, organizationSections, type NavItem, type NavSection } from '../../data/navigationData';
import cuLogo from '../../assets/RPC logo updated document.png';
import QuickAttendanceSign from '../attendance/QuickAttendanceSign';

interface UserData {
  username: string;
  email: string;
  profilePhoto?: string;
}

interface Session {
  _id: string;
  title: string;
  yearJoined?: string;
  leadershipRole: string;
  isActive: boolean;
  startTime: string;
  durationMinutes: number;
}

// Cascading flyout menu item for desktop - children appear to the right (or left if near edge)
const FlyoutItem = ({ item, onClose, forceLeft = false }: { item: NavItem; onClose: () => void; forceLeft?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [openLeft, setOpenLeft] = useState(forceLeft);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const hasChildren = item.children && item.children.length > 0;

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (forceLeft) {
      setOpenLeft(true);
    } else if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      setOpenLeft(spaceRight < 220);
    }
    setIsHovered(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setIsHovered(false), 120);
  };

  if (hasChildren) {
    return (
      <div
        ref={itemRef}
        className="relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <button
          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-left ${isHovered ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
            }`}
        >
          <span>{item.label}</span>
          <ChevronRight size={14} className={`text-gray-400 flex-shrink-0 ml-2 ${openLeft && isHovered ? 'rotate-180' : ''}`} />
        </button>

        {isHovered && (
          <div
            className="absolute top-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
            style={{
              minWidth: '200px',
              maxWidth: '260px',
              ...(openLeft
                ? { right: '100%', marginRight: '4px' }
                : { left: '100%', marginLeft: '4px' }),
            }}
          >
            {item.children!.map((child, i) => (
              <FlyoutItem key={i} item={child} onClose={onClose} forceLeft={openLeft} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-[#730051] hover:bg-purple-50 rounded-md transition-colors"
        onClick={onClose}
      >
        <span className="truncate">{item.label}</span>
        <ExternalLink size={12} className="text-gray-400 flex-shrink-0" />
      </a>
    );
  }

  return (
    <Link
      to={item.href || '#'}
      className="block px-3 py-2 text-sm text-gray-700 hover:text-[#730051] hover:bg-purple-50 rounded-md transition-colors truncate"
      onClick={onClose}
    >
      {item.label}
    </Link>
  );
};

// Mobile sidebar nav item
const MobileSidebarItem = ({ item, depth = 0, onClose }: { item: NavItem; depth?: number; onClose: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-left transition-colors ${isOpen ? 'text-[#730051] bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
            }`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
        >
          <span className="text-sm break-words min-w-0">{item.label}</span>
          <ChevronRight
            size={14}
            className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}>
          {item.children!.map((child, i) => (
            <MobileSidebarItem key={i} item={child} depth={depth + 1} onClose={onClose} />
          ))}
        </div>
      </div>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 py-2 px-3 rounded-md text-sm text-gray-600 hover:text-[#730051] hover:bg-purple-50 transition-colors"
        style={{ paddingLeft: `${12 + depth * 12}px` }}
        onClick={onClose}
      >
        {item.label}
        <ExternalLink size={11} className="text-gray-400" />
      </a>
    );
  }

  return (
    <Link
      to={item.href || '#'}
      className="block py-2 px-3 rounded-md text-sm text-gray-600 hover:text-[#730051] hover:bg-purple-50 transition-colors"
      style={{ paddingLeft: `${12 + depth * 12}px` }}
      onClick={onClose}
    >
      {item.label}
    </Link>
  );
};


// Icon map for mobile sidebar tabs
const mobileNavTabs: { key: string; icon: React.ElementType; label: string; }[] = [
  { key: 'dashboard', icon: Home, label: 'Home' },
  { key: 'aboutUs', icon: Info, label: 'About Us' },
  { key: 'philosophies', icon: BookOpen, label: 'Philosophies' },
  { key: 'financials', icon: Coins, label: 'Financials' },
  { key: 'leadership', icon: Crown, label: 'Leadership' },
  { key: 'media', icon: Tv2, label: 'Gallery' },
  { key: 'feedback', icon: MessageSquare, label: 'Talk to us' },
];

interface TabSection {
  title: string;
  icon: React.ElementType;
  items: { label: string; href?: string; external?: boolean; children?: { label: string; href?: string }[] }[];
}

const getTabSections = (key: string, activeSessions: Session[]): TabSection[] => {
  switch (key) {
    case 'aboutUs': return [{ title: 'About Us', icon: Info, items: headerNavGroups.aboutUs }];
    case 'ministries': return [{ title: 'Ministries', icon: Music, items: organizationSections[3].items }];
    case 'boards': return [{ title: 'Boards', icon: Building2, items: organizationSections[1].items }];
    case 'eteams': return [{ title: 'E. Teams', icon: Globe, items: organizationSections[2].items }];
    case 'fellowships': return [{ title: 'Fellowships', icon: UsersRound, items: organizationSections[4].items }];
    case 'biblestudy': return [{ title: 'Bible Study', icon: BookOpen, items: [{ label: 'Register for Bible Study', href: '/Bs' }, { label: 'View BS Groups', href: '/Bs' }] }];
    case 'classes': return [{ title: 'Classes', icon: GraduationCap, items: organizationSections[6].items }];
    case 'feedback': return [{ title: 'Talk to us', icon: MessageSquare, items: [{ label: 'Submit Anonymously', href: '/recomendations' }, { label: 'Submit with Identity', href: '/recomendations' }] }];
    case 'financials': return [{ title: 'Financials', icon: Coins, items: [{ label: 'View Financial Statements', href: '/financial' }, { label: 'My Contributions', href: '/financial' }] }];
    case 'requisitions': return [{ title: 'Requisitions', icon: FileText, items: [{ label: 'My Requisitions', href: '/requisitions' }, { label: 'New Requisition', href: '/requisitions' }] }];
    case 'filemanager': return [{ title: 'File Manager', icon: Folder, items: [{ label: 'My Documents', href: '/my-docs' }, { label: 'Shared Files', href: '/my-docs' }] }];
    case 'library': return [{ title: 'Library', icon: Book, items: [{ label: 'Search Books', href: '/library' }, { label: 'My Borrows', href: '/library' }] }];
    case 'winasoul': return [{ title: 'Win a Soul', icon: UserPlus, items: [{ label: 'Mission Reports', href: '/save' }, { label: 'Evangelism Guide', href: '/save' }] }];
    case 'leadership': return [{ title: 'Leadership', icon: Crown, items: organizationSections[7].items }];
    case 'governingdocs': return [{ title: 'Governing Docs', icon: FileText, items: [{ label: 'Constitution', href: '/pdfs/constitution.pdf', external: true }, { label: 'Financial Policy', href: '#' }, { label: 'Leadership Manual', href: '#' }] }];
    case 'attendance':
      if (activeSessions.length === 0) return [];
      return [{ title: 'Active Sessions', icon: ClipboardList, items: activeSessions.map(s => ({ label: s.title, href: `/attendance?session=${s._id}` })) }];
    case 'committees': return [{ title: 'Committees', icon: UsersRound, items: organizationSections[5].items }];
    default: return [];
  }
};


const MobileSidebarMenu = ({ userData, activeSessions, onNavigate, activeNav, isManualExpanded, setIsManualExpanded }: {
  userData: UserData | null;
  activeSessions: Session[];
  onNavigate: (path: string) => void;
  activeNav: string | null;
  isManualExpanded: boolean;
  setIsManualExpanded: (val: boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [expandedNestedItem, setExpandedNestedItem] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Expansion happens when any tab is active OR manually toggled via hamburger
  const isExpanded = !!activeTab || isManualExpanded;

  const handleTabClick = (key: string) => {
    if (key === 'dashboard') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (key === 'about') {
      setActiveTab(null);
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if (key === 'signin') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate(userData ? '/changeDetails' : '/signIn');
      return;
    }
    if (key === 'philosophies') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/philosophy');
      return;
    }
    if (key === 'biblestudy') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/Bs');
      return;
    }
    if (key === 'financials') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/financial');
      return;
    }
    if (key === 'feedback') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/recomendations');
      return;
    }
    if (activeTab === key) {
      setActiveTab(null);
      setExpandedNestedItem(null);
      return;
    }
    if (key === 'winasoul') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/save');
      return;
    }
    if (key === 'library') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/library');
      return;
    }
    if (key === 'filemanager') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/my-docs');
      return;
    }
    if (key === 'requisitions') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/requisitions');
      return;
    }
    if (key === 'media') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/media');
      return;
    }
    if (key === 'leadership') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/leadership');
      return;
    }
    if (key === 'attendance') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      // Scroll to the inline attendance section on the landing page
      const el = document.getElementById('live-attendance');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Navigate home first, then scroll after render
        onNavigate('/');
        setTimeout(() => {
          const target = document.getElementById('live-attendance');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
      }
      return;
    }
    setActiveTab(key);
    setIsManualExpanded(true);
    // Scroll to show the dropdown after it renders
    setTimeout(() => {
      const dropdown = dropdownRefs.current[key];
      if (dropdown) {
        dropdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        // Fallback: scroll button to top so dropdown appears below
        buttonRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  const closePanel = () => {
    setActiveTab(null);
    setExpandedNestedItem(null);
    setIsManualExpanded(false);
  };

  const sections = activeTab ? getTabSections(activeTab, activeSessions) : [];

  return (
    <div className="md:hidden">
      {/* Backdrop for click-outside collapse */}
      {isExpanded && (
        <div
          style={{ position: 'fixed', top: '104px', left: 0, right: 0, bottom: 0, zIndex: 99997, background: 'rgba(0,0,0,0.15)' }}
          onClick={closePanel}
        />
      )}

      {/* Icon strip / Sidebar */}
      <div ref={sidebarRef} style={{
        position: 'fixed', top: '104px', left: 0, bottom: 0,
        width: isExpanded ? '180px' : '52px',
        backgroundColor: '#D6170F',
        display: 'block',
        textAlign: isExpanded ? 'left' : 'center',
        paddingTop: '6px', paddingBottom: '6px',
        paddingLeft: isExpanded ? '6px' : '0',
        overflowY: 'scroll', WebkitOverflowScrolling: 'touch', zIndex: 99999,
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease',
        boxShadow: isExpanded ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
      }}>
        {mobileNavTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key || (activeNav === tab.key && !activeTab);
          const isAttendance = tab.key === 'attendance';
          const hasActiveSessions = activeSessions.length > 0;
          const hasSections = getTabSections(tab.key, activeSessions).length > 0;

          const isUser = tab.key === 'signin' && userData;

          return (
            <Fragment key={tab.key}>
              <button
                ref={el => { buttonRefs.current[tab.key] = el; }}
                onClick={() => handleTabClick(tab.key)}
                title={tab.label}
                style={{
                  width: isExpanded ? '168px' : '46px',
                  minHeight: '38px',
                  marginBottom: '2px',
                  display: 'flex',
                  flexDirection: isExpanded ? 'row' : 'column',
                  alignItems: 'center',
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  paddingLeft: isExpanded ? '10px' : '0',
                  margin: isExpanded ? '0' : '0 auto',
                  borderRadius: '6px', border: 'none', cursor: 'pointer',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.95)' : 'transparent',
                  color: isActive ? '#D6170F' : 'rgba(255,255,255,0.85)',
                  gap: isExpanded ? '10px' : '2px',
                  flexShrink: 0, position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px' }}>
                  {isUser ? (
                    userData?.profilePhoto ? (
                      <img
                        src={getImageUrl(userData.profilePhoto)}
                        alt=""
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.8)' }}
                      />
                    ) : (
                      <User size={22} />
                    )
                  ) : (
                    <Icon size={22} />
                  )}
                </div>

                {isAttendance && hasActiveSessions && (
                  <span style={{
                    position: 'absolute',
                    top: isExpanded ? '16px' : '6px',
                    left: isExpanded ? '28px' : 'auto',
                    right: isExpanded ? 'auto' : '6px',
                    width: '8px', height: '8px',
                    background: '#ef4444', borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(239,68,68,0.8)',
                    animation: 'pulse 2s infinite',
                  }} />
                )}

                {isExpanded && (
                  <span style={{
                    fontSize: '13px',
                    lineHeight: 1.1,
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.1px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                  }}>
                    {isUser ? 'Profile' : tab.label}
                  </span>
                )}

                {hasSections && isExpanded && (
                  <div style={{ marginLeft: 'auto', marginRight: '6px', display: 'flex', alignItems: 'center' }}>
                    <ChevronDown size={12} style={{ opacity: isActive ? 0.8 : 0.4, transform: isActive ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                  </div>
                )}
              </button>

              {/* Inline dropdown */}
              {isExpanded && isActive && sections.length > 0 && (
                <div
                  ref={el => { dropdownRefs.current[tab.key] = el; }}
                  style={{
                    width: '168px',
                    background: 'rgba(255,255,255,0.98)',
                    borderRadius: '8px',
                    marginTop: '2px',
                    marginBottom: '4px',
                    maxHeight: '45vh',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(183,28,28,0.2)',
                  }}>
                  {sections.map((section, idx) => (
                    <div key={idx} style={{ padding: '4px 0' }}>
                      {(section.title.toLowerCase() !== tab.label.toLowerCase() || sections.length > 1) && (
                        <div style={{
                          padding: '6px 16px 4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#D6170F',
                          opacity: 0.7,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {section.title}
                        </div>
                      )}

                      {section.items.map((item, i) => (
                        <div key={i}>
                          <Link
                            to={item.href || '#'}
                            onClick={(e) => {
                              if (item.children && item.children.length > 0) {
                                e.preventDefault();
                                setExpandedNestedItem(expandedNestedItem === item.label ? null : item.label);
                              } else {
                                closePanel();
                              }
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '8px 14px', color: '#374151', fontSize: '12px',
                              textDecoration: 'none', transition: 'all 0.15s',
                              fontWeight: 600
                            }}
                          >
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {item.children && (
                              <ChevronRight
                                size={10}
                                style={{
                                  opacity: 0.5,
                                  transform: expandedNestedItem === item.label ? 'rotate(90deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s'
                                }}
                              />
                            )}
                          </Link>

                          {item.children && (
                            <div style={{
                              paddingLeft: '12px',
                              background: '#fafafa',
                              maxHeight: expandedNestedItem === item.label ? '500px' : '0',
                              overflow: 'hidden',
                              transition: 'all 0.3s ease-in-out'
                            }}>
                              {item.children.map((child, j) => (
                                <Link
                                  key={j}
                                  to={child.href || '#'}
                                  onClick={closePanel}
                                  style={{
                                    display: 'block', padding: '10px 16px',
                                    color: '#6b7280', fontSize: '11px',
                                    textDecoration: 'none',
                                    fontWeight: 400
                                  }}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      <style>{`
        @keyframes accordionDown {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 45vh; }
        }
      `}</style>
    </div>
  );
};


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPatron, setIsPatron] = useState(false);
  const [isAssistantPatron, setIsAssistantPatron] = useState(false);
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [signingSession, setSigningSession] = useState<Session | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    // Clear all cookies
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
    localStorage.clear();
    sessionStorage.clear();
    setIsAdmin(false);
    setIsPatron(false);
    setIsAssistantPatron(false);
    setUserData(null);
    navigate('/signIn', { replace: true });
  };
  const location = useLocation();

  // Determine which nav group is active based on current path
  const getActiveNav = (path: string): string | null => {
    if (path.startsWith('/about') || path.startsWith('/history') || path.startsWith('/vision-mission') || path.startsWith('/statement-of-faith')) return 'aboutUs';
    if (path.startsWith('/philosophy')) return 'philosophies';
    if (path === '/') return 'dashboard';
    if (path.startsWith('/news') || path.startsWith('/media')) return 'mediadesk';
    if (path.startsWith('/ministries')) return 'ministries';
    if (path.startsWith('/ets/') || path.startsWith('/e-teams')) return 'eteams';
    if (['/brothersfellowship', '/sistersfellowship', '/fellowships'].some(p => path.startsWith(p))) return 'fellowships';
    if (path.startsWith('/classes') || path.startsWith('/bestpClass')) return 'classes';
    if (path.startsWith('/Bs') || path.startsWith('/biblestudy')) return 'biblestudy';
    if (path.startsWith('/financial')) return 'financials';
    if (path.startsWith('/recomendations')) return 'feedback';
    if (path.startsWith('/compassion-counseling')) return 'compassion';
    if (path.startsWith('/requisitions')) return 'requisitions';
    if (path.startsWith('/my-docs')) return 'filemanager';
    if (path.startsWith('/library')) return 'library';
    if (path.startsWith('/save')) return 'winasoul';
    if (path.startsWith('/boards')) return 'boards';
    if (path.startsWith('/other-committees')) return 'committees';
    if (path.startsWith('/leadership')) return 'leadership';
    if (path.startsWith('/governing-docs')) return 'governingdocs';
    if (path.startsWith('/attendance') || path.startsWith('/session')) return 'attendance';
    return null;
  };
  const activeNav = getActiveNav(location.pathname);
  
  const isPatronDashboard = location.pathname.startsWith('/patron') && !location.pathname.startsWith('/assistant-patron');
  const isAssistantPatronDashboard = location.pathname.startsWith('/assistant-patron');
  const isChairpersonDashboard = location.pathname.startsWith('/chairperson');
  const isTreasurerDashboard = location.pathname.startsWith('/treasurer');
  const isDashboard = isPatronDashboard || isAssistantPatronDashboard || isChairpersonDashboard || isTreasurerDashboard;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchActiveSessions = async () => {
    try {
      const timestamp = Date.now();
      const response = await fetch(`${getApiUrl('attendanceSessionStatus')}?t=${timestamp}`, {
        credentials: 'include',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error loading active sessions:', error);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
    const interval = setInterval(fetchActiveSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(getApiUrl('users'), { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          const firstName = data.username?.split(' ')[0] || data.username;
          setUserData({ ...data, username: firstName });
          setIsAdmin(false);
          setIsPatron(false);
          setIsAssistantPatron(false);
        } else if (localStorage.getItem('adminSession') === 'true') {
          // Verify admin session with backend
          try {
            const apiUrl = getApiUrl('superAdmin').replace('/login', '');
            const adminRes = await fetch(`${apiUrl}/verify`, { credentials: 'include' });
            if (adminRes.ok) {
              setIsAdmin(true);
              setIsPatron(localStorage.getItem('patronSession') === 'true');
              setIsAssistantPatron(localStorage.getItem('assistantPatronSession') === 'true');
            } else {
              localStorage.removeItem('adminSession');
              localStorage.removeItem('patronSession');
              localStorage.removeItem('assistantPatronSession');
              setIsAdmin(false);
              setIsPatron(false);
              setIsAssistantPatron(false);
            }
          } catch (e) {
            console.error('Error verifying admin session:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();

    // Listen for manual user data updates (like profile photo changes)
    window.addEventListener('userDataUpdated', fetchUser);
    return () => window.removeEventListener('userDataUpdated', fetchUser);
  }, [location.pathname]);

  const handleMouseEnter = (key: string) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const closeDropdown = () => setActiveDropdown(null);

  const renderCascadePanel = (sections: NavSection[], alignRight = false) => (
    <div className={`absolute top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50 ${alignRight ? 'right-0' : 'left-0'}`}>
      {sections.map((section) => (
        <FlyoutItem key={section.title} item={{ label: section.title, children: section.items }} onClose={closeDropdown} />
      ))}
    </div>
  );

  const renderAboutUsPanel = () => (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50">
      {headerNavGroups.aboutUs.map((item, i) => (
        <FlyoutItem key={i} item={item} onClose={closeDropdown} />
      ))}
    </div>
  );

  const renderMediaDeskPanel = () => (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[220px] z-50">
      {headerNavGroups.mediaDesk.map((item, i) => (
        <FlyoutItem key={i} item={item} onClose={closeDropdown} />
      ))}
    </div>
  );
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100005] transition-all duration-300 border-b-2 border-[#730051]/15 ${isScrolled ? 'bg-white shadow-lg shadow-black/5' : 'bg-white/95 backdrop-blur-sm'}`}>
        {/* Creative Top Bar Red Strip */}
        <div className="bg-[#E0221A] text-white h-10 md:h-9 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex flex-col md:flex-row justify-between items-center text-[10px] xl:text-xs font-semibold gap-1 py-1 md:py-0 select-none">
            <div className="flex items-center gap-4">
              <a href="mailto:communityofbelieversinjesus@gmail.com" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
                <span className="text-[#FFB300]"><i className="fas fa-envelope"></i></span>
                <span className="hidden sm:inline">communityofbelieversinjesus@gmail.com</span>
                <span className="sm:hidden">Email Us</span>
              </a>
              <span className="text-white/30 hidden sm:inline">|</span>
              <a href="tel:+254762053876" className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
                <span className="text-[#FFB300]"><i className="fas fa-phone"></i></span>
                <span>+254 762 053 876</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[#FFB300] text-xs flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Lipa Na M-PESA Till: 5173289
                </span>
              </div>
              <span className="text-white/30 hidden md:inline">|</span>
              <div className="flex items-center gap-2.5">
                <a href="https://www.facebook.com/share/18rhcZ1XpA/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="https://www.youtube.com/@savedbychriststainedbylove" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors" title="YouTube"><i className="fab fa-youtube"></i></a>
                <a href="https://www.tiktok.com/@rikurumapentecostal" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors" title="TikTok"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-16 md:h-16 xl:h-20 md:pl-0">
            <button
              onClick={() => {
                if (isDashboard) {
                  let eventName = 'toggleSidebar';
                  if (isPatronDashboard) eventName = 'togglePatronSidebar';
                  else if (isAssistantPatronDashboard) eventName = 'toggleAssistantPatronSidebar';
                  else if (isChairpersonDashboard) eventName = 'toggleChairpersonSidebar';
                  else if (isTreasurerDashboard) eventName = 'toggleTreasurerSidebar';
                  window.dispatchEvent(new Event(eventName));
                } else {
                  setIsSidebarExpanded(!isSidebarExpanded);
                }
              }}
              className="md:hidden w-[52px] h-full flex items-center justify-center flex-shrink-0 hover:bg-red-50 active:scale-95 transition-all duration-200 -ml-4"
              aria-label="Toggle Menu"
            >
              <Menu size={24} className="text-[#E0221A] hover:text-[#D6170F] transition-colors" />
            </button>

            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="md:hidden flex-1 flex items-center justify-center gap-1 min-w-0 pr-1">
              <img src={cuLogo} alt="RPC Logo" className="w-8 h-8 object-contain flex-shrink-0" />
              <div className="flex flex-col items-center overflow-hidden min-w-0">
                <span className="text-gray-900 leading-none text-[10px] tracking-tight truncate w-full text-center" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                  Rikuruma Pentecostal Church
                </span>
                <div className="flex items-center justify-center gap-1 mt-0.5 w-full">
                  <div className="h-[1px] w-2 bg-[#FF3B30]/30 hidden sm:block"></div>
                  <span className="text-[#FF3B30] text-[10px] tracking-wider truncate font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      NYAMIRA
                    </span>
                  <div className="h-[1px] w-2 bg-[#FF3B30]/30 hidden sm:block"></div>
                </div>
              </div>
            </Link>

            {/* Mobile User/Sign In Button */}
            {!isDashboard && (
              <div className="md:hidden flex-shrink-0">
                {isAdmin && isPatron ? (
                  <button onClick={() => navigate('/patron')} className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 bg-white hover:bg-red-50 border border-[#FF3B30]/20 rounded-full font-bold text-[#FF3B30] transition-all shadow-sm active:scale-95 whitespace-nowrap">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#FF3B30] text-white">
                      <Crown size={12} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] leading-none tracking-tight">Patron</span>
                  </button>
                ) : isAdmin && isAssistantPatron ? (
                  <button onClick={() => navigate('/assistant-patron')} className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 bg-white hover:bg-red-50 border border-[#FF3B30]/20 rounded-full font-bold text-[#FF3B30] transition-all shadow-sm active:scale-95 whitespace-nowrap">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#FF3B30] text-white">
                      <Crown size={12} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] leading-none tracking-tight">Asst Patron</span>
                  </button>
                ) : isAdmin ? (
                  <button onClick={handleAdminLogout} className="flex items-center gap-1 pl-1 pr-2 py-1 bg-[#FF3B30] text-white rounded-full transition-all shadow-sm active:scale-95 whitespace-nowrap">
                    <LogOut size={12} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">Log Out</span>
                  </button>
                ) : userData ? (
                  <button onClick={() => navigate('/changeDetails')} className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 bg-white hover:bg-red-50 border border-[#FF3B30]/20 rounded-full font-bold text-[#FF3B30] transition-all shadow-sm active:scale-95 whitespace-nowrap group">
                    <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-[#FF3B30] flex items-center justify-center bg-[#FF3B30]/5 transition-transform group-hover:scale-110">
                      {userData.profilePhoto ? (
                        <img src={getImageUrl(userData.profilePhoto)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={14} className="text-[#FF3B30]" strokeWidth={2.5} />
                      )}
                    </div>
                    <span className="text-[10px] capitalize leading-none tracking-tight">{userData.username}</span>
                  </button>
                ) : (
                  <Link to="/signIn" className="flex items-center gap-1 pl-1 pr-2 py-1 bg-red-50 hover:bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-full font-bold text-[#FF3B30] transition-all shadow-sm active:scale-95 whitespace-nowrap">
                    <div className="bg-[#FF3B30] text-white p-0.5 rounded-full flex items-center justify-center">
                      <LogIn size={12} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] leading-none tracking-tight">Log In</span>
                  </Link>
                )}
              </div>
            )}

            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hidden md:flex items-center gap-2 xl:gap-3 flex-shrink-0">
              <img src={cuLogo} alt="RPC Logo" className="w-10 h-10 xl:w-14 xl:h-14 object-contain flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <div className="text-gray-900 leading-none tracking-tight uppercase" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                  <span className="hidden xl:inline text-base">Rikuruma Pentecostal Church</span>
                  <span className="xl:hidden text-[11px]">RPC</span>
                </div>
                <div className="hidden xl:flex items-center gap-2 mt-1.5 w-full">
                  <div className="h-[1px] flex-1 bg-[#FF3B30]/30"></div>
                  <span className="text-[#FF3B30] text-xs xl:text-sm font-semibold tracking-wider whitespace-nowrap px-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    NYAMIRA
                  </span>
                  <div className="h-[1px] flex-1 bg-[#FF3B30]/30"></div>
                </div>
              </div>
            </Link>

            {!isDashboard ? (
              <nav className="hidden md:flex items-center flex-1 min-w-0 md:ml-2 lg:ml-4 xl:ml-8">
                {/* Centered nav links */}
                <div className="flex-1 flex items-center justify-center gap-0.5 lg:gap-1.5 xl:gap-4 min-w-0">
                  <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`nav-link-underline px-1 lg:px-2 xl:px-3 py-2 font-medium text-[11px] lg:text-xs xl:text-sm whitespace-nowrap ${location.pathname === '/' ? 'text-[#FF3B30] nav-link-active' : 'text-gray-700'}`}>Home</Link>

                  {/* About Us dropdown */}
                  <div className="relative" onMouseEnter={() => handleMouseEnter('aboutUs')} onMouseLeave={handleMouseLeave}>
                    <button className={`nav-link-underline flex items-center gap-0.5 px-1 lg:px-2 xl:px-3 py-2 font-medium text-[11px] lg:text-xs xl:text-sm whitespace-nowrap ${activeDropdown === 'aboutUs' || activeNav === 'aboutUs' ? 'text-[#FF3B30] nav-link-active' : 'text-gray-700'}`}>
                      About Us
                      <ChevronDown size={12} className={`xl:w-[14px] xl:h-[14px] transition-transform ${activeDropdown === 'aboutUs' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'aboutUs' && renderAboutUsPanel()}
                  </div>

                  <Link to="/philosophy" className={`nav-link-underline px-1 lg:px-2 xl:px-3 py-2 font-medium text-[11px] lg:text-xs xl:text-sm whitespace-nowrap ${activeNav === 'philosophies' ? 'text-[#FF3B30] nav-link-active' : 'text-gray-700'}`}>Philosophies</Link>

                  <Link to="/financial" className={`nav-link-underline px-1 lg:px-2 xl:px-3 py-2 font-medium text-[11px] lg:text-xs xl:text-sm whitespace-nowrap ${activeNav === 'financials' ? 'text-[#FF3B30] nav-link-active' : 'text-gray-700'}`}>Financials</Link>

                  <Link to="/leadership" className={`nav-link-underline px-1 lg:px-2 xl:px-3 py-2 font-medium text-[11px] lg:text-xs xl:text-sm whitespace-nowrap ${activeNav === 'leadership' ? 'text-[#FF3B30] nav-link-active' : 'text-gray-700'}`}>Leadership</Link>

                  {/* Gallery Link */}
                  <Link to="/media" className={`nav-link-underline px-1 lg:px-2 xl:px-3 py-2 font-medium text-[11px] lg:text-xs xl:text-sm whitespace-nowrap ${activeNav === 'media' ? 'text-[#FF3B30] nav-link-active' : 'text-gray-700'}`}>Gallery</Link>

                  <Link to="/recomendations" className={`nav-link-underline px-1 lg:px-2 xl:px-3 py-2 font-medium text-[11px] lg:text-xs xl:text-sm whitespace-nowrap ${activeNav === 'feedback' ? 'text-[#FF3B30] nav-link-active' : 'text-gray-700'}`}>Talk to us</Link>
                </div>

                {/* Sign In / User / Admin Logout / Patron button - always right */}
                <div className="flex-shrink-0 ml-2 xl:ml-4">
                  {isAdmin && isPatron ? (
                    <button onClick={() => navigate('/patron')} className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 bg-white hover:bg-red-50 border-2 border-[#FF3B30]/10 hover:border-[#FF3B30]/30 rounded-full font-bold text-[#FF3B30] transition-all shadow-md hover:shadow-[#FF3B30]/5 active:scale-95 whitespace-nowrap group">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FF3B30] text-white transition-all group-hover:ring-2 group-hover:ring-red-200">
                        <Crown size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[12px] xl:text-[13px] leading-none tracking-tight">Patron</span>
                    </button>
                  ) : isAdmin && isAssistantPatron ? (
                    <button onClick={() => navigate('/assistant-patron')} className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 bg-white hover:bg-red-50 border-2 border-[#FF3B30]/10 hover:border-[#FF3B30]/30 rounded-full font-bold text-[#FF3B30] transition-all shadow-md hover:shadow-[#FF3B30]/5 active:scale-95 whitespace-nowrap group">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FF3B30] text-white transition-all group-hover:ring-2 group-hover:ring-red-200">
                        <Crown size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[12px] xl:text-[13px] leading-none tracking-tight">Assistant Patron</span>
                    </button>
                  ) : isAdmin ? (
                    <button onClick={handleAdminLogout} className="flex items-center gap-1.5 px-2.5 xl:px-4 py-1.5 xl:py-2 bg-[#FF3B30] text-white font-medium text-[11px] xl:text-sm rounded-lg hover:bg-[#E0221A] transition-colors shadow-lg shadow-red-900/10 active:scale-95 transform transition-all whitespace-nowrap">
                      <LogOut size={16} className="xl:w-[18px] xl:h-[18px]" />
                      <span className="hidden xl:inline">Log Out</span>
                    </button>
                  ) : userData ? (
                    <button onClick={() => navigate('/changeDetails')} className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 bg-white hover:bg-red-50 border-2 border-[#FF3B30]/10 hover:border-[#FF3B30]/30 rounded-full font-bold text-[#FF3B30] transition-all shadow-md hover:shadow-[#FF3B30]/5 active:scale-95 whitespace-nowrap group">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#FF3B30] flex items-center justify-center bg-[#FF3B30]/5 transition-all group-hover:ring-2 group-hover:ring-red-200">
                        {userData.profilePhoto ? (
                          <img src={getImageUrl(userData.profilePhoto)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} className="text-[#FF3B30]" strokeWidth={2.5} />
                        )}
                      </div>
                      <span className="text-[12px] xl:text-[13px] capitalize leading-none tracking-tight">{userData.username}</span>
                    </button>
                  ) : (
                    <Link to="/signIn" className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 bg-red-50 hover:bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-full font-bold text-[#FF3B30] transition-all shadow-sm active:scale-95 whitespace-nowrap">
                      <div className="bg-[#FF3B30] text-white p-1 rounded-full flex items-center justify-center">
                        <LogIn size={14} className="xl:w-[16px] xl:h-[16px]" strokeWidth={2.5} />
                      </div>
                      <span className="text-[11px] xl:text-sm leading-none tracking-tight">Log In</span>
                    </Link>
                  )}
                </div>
              </nav>
            ) : (
              <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                 <span className="flex items-center gap-2.5 font-bold text-[11px] uppercase bg-white px-6 py-2 rounded-full shadow-sm border border-gray-200 transition-all hover:shadow-md" style={{ letterSpacing: '0.1em' }}>
                   <Crown size={15} className="text-[#730051]" strokeWidth={2.5} />
                   <span className="text-gray-700 font-bold" style={{ letterSpacing: '0.08em' }}>RPC Nyamira</span>
                   <span className="text-gray-300 text-[10px] px-1">•</span>
                   <span className="text-[#730051]">
                     {isPatronDashboard ? 'RPC SENIOR PASTOR PORTAL' : 
                      isAssistantPatronDashboard ? 'ASSISTANT PATRON PORTAL' : 
                      isChairpersonDashboard ? 'CHAIRPERSON PORTAL' : 
                      'TREASURER PORTAL'}
                   </span>
                 </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {activeDropdown && <div className="fixed inset-0 z-40 hidden md:block" onClick={closeDropdown} />}

      {!isDashboard && (
        <MobileSidebarMenu
          userData={userData}
          activeSessions={activeSessions}
          onNavigate={(path: string) => navigate(path)}
          activeNav={activeNav}
          isManualExpanded={isSidebarExpanded}
          setIsManualExpanded={setIsSidebarExpanded}
        />
      )}

      {signingSession && (
        <QuickAttendanceSign
          session={signingSession}
          onClose={() => setSigningSession(null)}
        />
      )}

      <style>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .animate-pulse-red {
          animation: pulse-red 2s infinite;
        }
        .nav-link-underline {
          position: relative;
          transition: color 0.2s ease;
        }
        .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          transform-origin: center;
          width: 80%;
          height: 3px;
          background: #FF3B30;
          border-radius: 2px;
          transition: transform 0.25s ease;
        }
        .nav-link-underline:hover {
          color: #FF3B30 !important;
        }
        .nav-link-underline:hover::after,
        .nav-link-underline.nav-link-active::after {
          transform: translateX(-50%) scaleX(1);
        }
        .nav-link-underline.nav-link-active {
          color: #FF3B30 !important;
        }
      `}</style>
    </>
  );
};

export default Header;
