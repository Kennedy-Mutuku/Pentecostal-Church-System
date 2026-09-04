// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User, ChevronDown, ChevronRight, ExternalLink, Menu,
  Home, Building2, Globe, Music,
  UsersRound, GraduationCap, Crown, LogIn, LogOut,
  ClipboardList, BookOpen, Tv2, FileText, AlertCircle,
  MessageSquare, Coins, Folder, Book, UserPlus, Info, Newspaper
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
          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-left ${isHovered ? 'text-[#3b1a62] bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
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
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-[#3b1a62] hover:bg-purple-50 rounded-md transition-colors"
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
      className="block px-3 py-2 text-sm text-gray-700 hover:text-[#3b1a62] hover:bg-purple-50 rounded-md transition-colors truncate"
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
          className={`w-full flex items-center justify-between py-2 px-3 rounded-md text-left transition-colors ${isOpen ? 'text-[#3b1a62] bg-purple-50' : 'text-gray-700 hover:bg-gray-50'
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
        className="flex items-center gap-1.5 py-2 px-3 rounded-md text-sm text-gray-600 hover:text-[#3b1a62] hover:bg-purple-50 transition-colors"
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
      className="block py-2 px-3 rounded-md text-sm text-gray-600 hover:text-[#3b1a62] hover:bg-purple-50 transition-colors"
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
  { key: 'departments', icon: Building2, label: 'Departments' },
  { key: 'choirs', icon: BookOpen, label: 'Choirs' },
  { key: 'leadership', icon: Crown, label: 'Leadership' },
  { key: 'media', icon: Tv2, label: 'Gallery' },
  { key: 'news', icon: Newspaper, label: 'News' },
  { key: 'feedback', icon: MessageSquare, label: 'Contact Us' },
  { key: 'financials', icon: Coins, label: 'Give' },
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
    case 'feedback': return [{ title: 'Contact Us', icon: MessageSquare, items: [{ label: 'Submit Anonymously', href: '/recomendations' }, { label: 'Submit with Identity', href: '/recomendations' }] }];
    case 'financials': return [{ title: 'Give', icon: Coins, items: [{ label: 'View Financial Statements', href: '/financial' }, { label: 'My Contributions', href: '/financial' }] }];
    case 'requisitions': return [{ title: 'Requisitions', icon: FileText, items: [{ label: 'My Requisitions', href: '/requisitions' }, { label: 'New Requisition', href: '/requisitions' }] }];
    case 'filemanager': return [{ title: 'File Manager', icon: Folder, items: [{ label: 'My Documents', href: '/my-docs' }, { label: 'Shared Files', href: '/my-docs' }] }];
    case 'library': return [{ title: 'Library', icon: Book, items: [{ label: 'Search Books', href: '/library' }, { label: 'My Borrows', href: '/library' }] }];
    case 'winasoul': return [{ title: 'Win a Soul', icon: UserPlus, items: [{ label: 'Mission Reports', href: '/save' }, { label: 'Evangelism Guide', href: '/save' }] }];
    case 'leadership': return [{ title: 'Leadership', icon: Crown, items: organizationSections[7].items }];
    case 'governingdocs': return [{ title: 'Governing Docs', icon: FileText, items: [{ label: 'Constitution', href: '/pdfs/constitution.pdf', external: true }, { label: 'Financial Policy', href: '#' }] }];
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
    if (key === 'departments') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/departments');
      return;
    }
    if (key === 'news') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/news');
      return;
    }
    if (key === 'choirs') {
      setActiveTab(null);
      setExpandedNestedItem(null);
      setIsManualExpanded(false);
      onNavigate('/choirs');
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
        width: isExpanded ? '148px' : '44px',
        backgroundColor: '#341558',
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
                  width: isExpanded ? '136px' : '38px',
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
                  color: isActive ? '#341558' : 'rgba(255,255,255,0.85)',
                  gap: isExpanded ? '10px' : '2px',
                  flexShrink: 0, position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isActive ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px' }}>
                  {isUser ? (
                    userData?.profilePhoto ? (
                      <img
                        src={profilePhotoUrl}
                        alt=""
                        style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,0.8)' }}
                      />
                    ) : (
                      <User size={18} />
                    )
                  ) : (
                    <Icon size={18} />
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
                    width: '136px',
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
                          color: '#341558',
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
  const [activeSessions, setActiveSessions] = useState<Session[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [signingSession, setSigningSession] = useState<Session | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Resolve once per actual photo change, not on every re-render (e.g. the 5s session poll below),
  // so the avatar doesn't flicker/re-fetch on every unrelated state update.
  const profilePhotoUrl = useMemo(
    () => (userData?.profilePhoto ? getImageUrl(userData.profilePhoto) : ''),
    [userData?.profilePhoto]
  );

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
    setUserData(null);
    navigate('/signIn', { replace: true });
  };
  const location = useLocation();

  // Determine which nav group is active based on current path
  const getActiveNav = (path: string): string | null => {
    if (path.startsWith('/about') || path.startsWith('/history') || path.startsWith('/vision-mission') || path.startsWith('/statement-of-faith')) return 'aboutUs';
    if (path.startsWith('/departments')) return 'departments';
    if (path.startsWith('/choirs')) return 'choirs';
    if (path.startsWith('/sermons')) return 'sermons';
    if (path === '/') return 'dashboard';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/media')) return 'mediadesk';
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
  
  const isPatronDashboard = location.pathname.startsWith('/patron');
  const isChairpersonDashboard = location.pathname.startsWith('/chairperson');
  const isTreasurerDashboard = location.pathname.startsWith('/treasurer');
  const isDashboard = isPatronDashboard || isChairpersonDashboard || isTreasurerDashboard;

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
        } else if (localStorage.getItem('adminSession') === 'true') {
          // Verify admin session with backend
          try {
            const apiUrl = getApiUrl('superAdmin').replace('/login', '');
            const adminRes = await fetch(`${apiUrl}/verify`, { credentials: 'include' });
            if (adminRes.ok) {
              setIsAdmin(true);
              setIsPatron(localStorage.getItem('patronSession') === 'true');
            } else {
              localStorage.removeItem('adminSession');
              localStorage.removeItem('patronSession');
              setIsAdmin(false);
              setIsPatron(false);
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

  const departmentNavItems = [
    { label: 'Trumpet of Yahweh Choir', href: '/departments#trumpet-of-yahweh' },
    { label: 'Born to Worship Choir',   href: '/departments#born-to-worship'    },
    { label: 'Agape Hearts Choir',      href: '/departments#agape-hearts'       },
    { label: 'Agape Voices',            href: '/departments#agape-voices'       },
    { label: 'Men Fellowship',          href: '/departments#men-fellowship'     },
    { label: 'Women Fellowship',        href: '/departments#women-fellowship'   },
    { label: 'Youths',                  href: '/departments#youths'             },
    { label: 'Sunday School',           href: '/departments#sunday-school'      },
    { label: 'Korera',                  href: '/departments#korera'             },
    { label: 'Welfare',                 href: '/departments#welfare'            },
  ];

  const renderDepartmentsPanel = () => (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[230px] z-50">
      {departmentNavItems.map((item, i) => (
        <FlyoutItem key={i} item={item} onClose={closeDropdown} />
      ))}
    </div>
  );

  const choirsNavItems = [
    { label: 'Trumpet of Yahweh Choir', href: '/choirs#trumpet' },
    { label: 'Agape Voice Choir', href: '/choirs#agape' },
    { label: 'Born to Worship Ministers', href: '/choirs#born-to-worship' },
  ];

  const renderChoirsPanel = () => (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[240px] z-50">
      {choirsNavItems.map((item, i) => (
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
      <header className={`fixed top-0 left-0 right-0 z-[100005] transition-all duration-300 ${isScrolled ? 'bg-[#f8f6f0] shadow-lg shadow-black/5' : 'bg-[#f8f6f0]'}`}>
        <div className="bg-[#4a1012] text-[#f8f6f0] h-10 border-b border-[#3a0a0c]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex justify-center md:justify-end items-center text-[13px] md:text-xs font-medium gap-5 md:gap-6 select-none">
            <Link to="/recomendations" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">I'm New</Link>
            <Link to="/recomendations" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Prayer Request</Link>
            <Link to="/recomendations" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-16 md:h-16 xl:h-20 md:pl-0 w-full justify-between">
            {/* Logo aligned to left */}
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="md:hidden flex-1 flex items-center justify-start gap-3.5 min-w-0">
              <img src={cuLogo} alt="RPC Logo" className="w-10 h-10 object-contain flex-shrink-0" />
              <div className="flex flex-col items-start justify-center min-w-0 h-full py-1">
                <span className="text-[#1a1a1a] tracking-tight text-left leading-[1.05]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '17px' }}>
                  Rikuruma Pentecostal Church
                </span>
                <div className="flex items-center justify-start mt-[3px] w-full">
                  <span className="text-[#555555] font-medium whitespace-nowrap uppercase text-left leading-none" style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', letterSpacing: '0.25em' }}>
                    NYAMIRA
                  </span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
            {/* Hamburger Menu (Aligned to right) */}
            <button
              onClick={() => {
                if (isDashboard) {
                  let eventName = 'toggleSidebar';
                  if (isPatronDashboard) eventName = 'togglePatronSidebar';
                  else if (isChairpersonDashboard) eventName = 'toggleChairpersonSidebar';
                  else if (isTreasurerDashboard) eventName = 'toggleTreasurerSidebar';
                  window.dispatchEvent(new Event(eventName));
                } else {
                  setIsSidebarExpanded(!isSidebarExpanded);
                }
              }}
              className="md:hidden flex flex-col justify-center gap-[7px] flex-shrink-0 active:scale-95 transition-all duration-200 pl-4 py-2"
              aria-label="Toggle Menu"
            >
              <div className="w-[28px] h-[2px] bg-[#1a1a1a] rounded-full"></div>
              <div className="w-[28px] h-[2px] bg-[#1a1a1a] rounded-full"></div>
              <div className="w-[28px] h-[2px] bg-[#1a1a1a] rounded-full"></div>
            </button>
          </div>

          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hidden md:flex items-center gap-2 xl:gap-3 flex-shrink-0">
              <img src={cuLogo} alt="RPC Logo" className="w-10 h-10 xl:w-14 xl:h-14 object-contain flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <div className="text-gray-900 leading-none tracking-tight" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
                  <span className="hidden xl:inline text-[15px] xl:text-[16px]">Rikuruma Pentecostal Church</span>
                  <span className="xl:hidden text-lg">RPC</span>
                </div>
                <div className="hidden xl:flex items-center gap-2 mt-1 w-full">
                  <span className="text-gray-500 text-[10px] xl:text-[11px] font-semibold tracking-[0.2em] whitespace-nowrap uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                    NYAMIRA
                  </span>
                </div>
              </div>
            </Link>

            {!isDashboard ? (
              <nav className="hidden md:flex items-center flex-1 min-w-0 md:ml-2 lg:ml-4 xl:ml-8">
                {/* Centered nav links */}
                <div className="flex-1 flex items-center justify-center gap-0.5 xl:gap-1.5 min-w-0">
                  <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`nav-link-underline px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${location.pathname === '/' ? 'nav-link-active text-white' : 'text-gray-700'}`}>Home</Link>

                  {/* About Us dropdown */}
                  <div className="relative" onMouseEnter={() => handleMouseEnter('aboutUs')} onMouseLeave={handleMouseLeave}>
                    <button onClick={() => { navigate('/about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`nav-link-underline flex items-center gap-0.5 px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${activeDropdown === 'aboutUs' || activeNav === 'aboutUs' ? 'nav-link-active text-white' : 'text-gray-700'}`}>
                      About Us
                      <ChevronDown size={12} className={`xl:w-[14px] xl:h-[14px] transition-transform ${activeDropdown === 'aboutUs' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'aboutUs' && renderAboutUsPanel()}
                  </div>

                  {/* Departments dropdown */}
                  <div className="relative" onMouseEnter={() => handleMouseEnter('departments')} onMouseLeave={handleMouseLeave}>
                    <button onClick={() => { navigate('/departments'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`nav-link-underline flex items-center gap-0.5 px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${activeDropdown === 'departments' || activeNav === 'departments' ? 'nav-link-active text-white' : 'text-gray-700'}`}>
                      Departments
                      <ChevronDown size={12} className={`xl:w-[14px] xl:h-[14px] transition-transform ${activeDropdown === 'departments' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'departments' && renderDepartmentsPanel()}
                  </div>

                  {/* Choirs dropdown */}
                  <div className="relative" onMouseEnter={() => handleMouseEnter('choirs')} onMouseLeave={handleMouseLeave}>
                    <button onClick={() => { navigate('/choirs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`nav-link-underline flex items-center gap-0.5 px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${activeDropdown === 'choirs' || activeNav === 'choirs' ? 'nav-link-active text-white' : 'text-gray-700'}`}>
                      Choirs
                      <ChevronDown size={12} className={`xl:w-[14px] xl:h-[14px] transition-transform ${activeDropdown === 'choirs' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'choirs' && renderChoirsPanel()}
                  </div>

                  <Link to="/sermons" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`nav-link-underline px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${activeNav === 'sermons' ? 'nav-link-active text-white' : 'text-gray-700'}`}>Sermons</Link>

                  <Link to="/leadership" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`nav-link-underline px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${activeNav === 'leadership' ? 'nav-link-active text-white' : 'text-gray-700'}`}>Leadership</Link>

                  {/* Gallery Link */}
                  <Link to="/media" className={`nav-link-underline px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${activeNav === 'media' ? 'nav-link-active text-white' : 'text-gray-700'}`}>Gallery</Link>

                  <Link to="/news" className={`nav-link-underline px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${activeNav === 'news' ? 'nav-link-active text-white' : 'text-gray-700'}`}>News</Link>

                  <Link to="/recomendations" className={`nav-link-underline px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${activeNav === 'feedback' ? 'nav-link-active text-white' : 'text-gray-700'}`}>Contact Us</Link>

                  <Link to="/financial" className={`nav-link-underline px-1 lg:px-1.5 xl:px-2 py-2 font-medium text-[11px] lg:text-[12px] xl:text-[13px] whitespace-nowrap ${activeNav === 'financials' ? 'nav-link-active text-white' : 'text-gray-700'}`}>Give</Link>
                </div>

                {/* Sign In / User / Admin Logout / Patron button - always right */}
                <div className="flex-shrink-0 ml-1 xl:ml-2">
                  {isAdmin && isPatron ? (
                    <button onClick={() => navigate('/patron')} className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 bg-white hover:bg-red-50 border-2 border-[#FF3B30]/10 hover:border-[#FF3B30]/30 rounded-full font-bold text-[#FF3B30] transition-all shadow-md hover:shadow-[#FF3B30]/5 active:scale-95 whitespace-nowrap group">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FF3B30] text-white transition-all group-hover:ring-2 group-hover:ring-red-200">
                        <Crown size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[12px] xl:text-[13px] leading-none tracking-tight">Patron</span>
                    </button>
                  ) : isAdmin ? (
                    <button onClick={handleAdminLogout} className="flex items-center gap-1.5 px-2.5 xl:px-4 py-1.5 xl:py-2 bg-[#FF3B30] text-white font-medium text-[11px] xl:text-sm rounded-lg hover:bg-[#E0221A] transition-colors shadow-lg shadow-red-900/10 active:scale-95 transform transition-all whitespace-nowrap">
                      <LogOut size={16} className="xl:w-[18px] xl:h-[18px]" />
                      <span className="hidden xl:inline">Log Out</span>
                    </button>
                  ) : userData ? (
                    <button onClick={() => navigate('/changeDetails')} className="flex items-center gap-2 pl-1.5 pr-4 py-1.5 bg-white hover:bg-purple-50 border-2 border-[#482078]/10 hover:border-[#482078]/30 rounded-full font-bold text-[#482078] transition-all shadow-md hover:shadow-[#482078]/5 active:scale-95 whitespace-nowrap group">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#482078] flex items-center justify-center bg-[#482078]/5 transition-all group-hover:ring-2 group-hover:ring-purple-200">
                        {userData.profilePhoto ? (
                          <img src={profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User size={18} className="text-[#482078]" strokeWidth={2.5} />
                        )}
                      </div>
                      <span className="text-[12px] xl:text-[13px] capitalize leading-none tracking-tight">{userData.username}</span>
                    </button>
                  ) : (
                    <Link to="/signIn" className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 bg-gray-50 hover:bg-gray-200 border border-black/20 rounded-full font-bold text-black transition-all shadow-sm active:scale-95 whitespace-nowrap">
                      <div className="bg-black text-white p-1 rounded-full flex items-center justify-center">
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
                   <Crown size={15} className="text-[#3b1a62]" strokeWidth={2.5} />
                   <span className="text-gray-700 font-bold" style={{ letterSpacing: '0.08em' }}>RPC Nyamira</span>
                   <span className="text-gray-300 text-[10px] px-1">•</span>
                   <span className="text-[#3b1a62]">
                     {isPatronDashboard ? 'RPC SENIOR PASTOR PORTAL' :
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

      {/* New Mobile Dropdown Menu replacing MobileSidebarMenu */}
      {!isDashboard && isSidebarExpanded && (
        <div className="fixed inset-0 z-[100004]" onClick={() => setIsSidebarExpanded(false)}>
          <div 
            className="absolute top-[104px] right-4 w-56 max-h-[70vh] overflow-y-auto bg-[#f8f6f0] rounded-2xl shadow-xl py-3 flex flex-col border border-black/5"
            onClick={e => e.stopPropagation()}
          >
            <Link to="/" onClick={() => { setIsSidebarExpanded(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${location.pathname === '/' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>Home</Link>
            
            <Link to="/about" onClick={() => setIsSidebarExpanded(false)} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${activeNav === 'aboutUs' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>About Us</Link>
            
            <Link to="/departments" onClick={() => setIsSidebarExpanded(false)} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${activeNav === 'departments' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>Departments</Link>
            
            <Link to="/choirs" onClick={() => setIsSidebarExpanded(false)} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${activeNav === 'choirs' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>Choirs</Link>
            
            <Link to="/sermons" onClick={() => setIsSidebarExpanded(false)} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${activeNav === 'sermons' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>Sermons</Link>
            
            <Link to="/leadership" onClick={() => setIsSidebarExpanded(false)} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${activeNav === 'leadership' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>Leadership</Link>
            
            <Link to="/media" onClick={() => setIsSidebarExpanded(false)} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${activeNav === 'media' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>Gallery</Link>
            
            <Link to="/news" onClick={() => setIsSidebarExpanded(false)} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${activeNav === 'news' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>News</Link>
            
            <Link to="/recomendations" onClick={() => setIsSidebarExpanded(false)} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${activeNav === 'feedback' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>Contact Us</Link>
            
            <Link to="/financial" onClick={() => setIsSidebarExpanded(false)} className={`mx-3 my-0.5 px-4 py-2 rounded-full text-[15px] ${activeNav === 'financials' ? 'bg-[#4a1012] text-white font-bold' : 'text-gray-900 font-medium hover:bg-black/5'}`}>Give</Link>
            
            <div className="mt-2 pt-4 pb-5 border-t border-black/5 flex justify-center px-4">
                {isAdmin && isPatron ? (
                  <button onClick={() => { setIsSidebarExpanded(false); navigate('/patron'); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-[#FF3B30]/20 rounded-full font-bold text-[#FF3B30] shadow-sm">
                    <Crown size={18} strokeWidth={2.5} />
                    <span>Patron</span>
                  </button>
                ) : isAdmin ? (
                  <button onClick={() => { setIsSidebarExpanded(false); handleAdminLogout(); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#FF3B30] text-white rounded-full font-bold shadow-sm">
                    <LogOut size={18} strokeWidth={2.5} />
                    <span>Log Out</span>
                  </button>
                ) : userData ? (
                  <button onClick={() => { setIsSidebarExpanded(false); navigate('/changeDetails'); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-[#482078]/20 rounded-full font-bold text-[#482078] shadow-sm">
                    <User size={18} strokeWidth={2.5} />
                    <span className="capitalize">{userData.username}</span>
                  </button>
                ) : (
                  <Link to="/signIn" onClick={() => setIsSidebarExpanded(false)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 border border-[#FF3B30]/20 rounded-full font-bold text-[#FF3B30] shadow-sm">
                    <LogIn size={18} strokeWidth={2.5} />
                    <span>Log In</span>
                  </Link>
                )}
            </div>
          </div>
        </div>
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
          transition: all 0.2s ease;
          border-radius: 9999px; /* Pill shape */
          padding: 4px 8px;
          margin: 0 1px;
        }
        .nav-link-underline:hover {
          background-color: #4a1012;
          color: #ffffff !important;
        }
        .nav-link-underline.nav-link-active {
          background-color: #4a1012;
          color: #ffffff !important;
        }
      `}</style>
    </>
  );
};

export default Header;
