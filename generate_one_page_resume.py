#!/usr/bin/env python3
"""
Generate One-Page ATS-Compatible Resume in DOCX format
"""

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

def add_hyperlink(paragraph, text, url):
    """Add a hyperlink to a paragraph"""
    part = paragraph.part
    r_id = part.relate_to(url, "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink", is_external=True)
    
    hyperlink = OxmlElement('w:hyperlink')
    hyperlink.set(qn('r:id'), r_id)
    
    new_run = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    
    c = OxmlElement('w:color')
    c.set(qn('w:val'), '0563C1')
    rPr.append(c)
    
    u = OxmlElement('w:u')
    u.set(qn('w:val'), 'single')
    rPr.append(u)
    
    new_run.append(rPr)
    new_run.text = text
    hyperlink.append(new_run)
    
    paragraph._p.append(hyperlink)
    return hyperlink

def create_one_page_resume():
    """Create the one-page ATS-optimized resume"""
    doc = Document()
    
    # Set narrow margins for one-page format
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.4)
        section.bottom_margin = Inches(0.4)
        section.left_margin = Inches(0.5)
        section.right_margin = Inches(0.5)
    
    # ========== HEADER ==========
    name = doc.add_paragraph()
    name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    name_run = name.add_run('JULIUS R.K TETTEH')
    name_run.font.size = Pt(16)
    name_run.font.bold = True
    name.paragraph_format.space_after = Pt(2)
    
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run('Full-Stack Web Developer & SaaS Solutions Architect')
    title_run.font.size = Pt(11)
    title_run.font.bold = True
    title.paragraph_format.space_after = Pt(2)
    
    contact = doc.add_paragraph()
    contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    contact.add_run('Accra, Ghana | +233203344991 | juliustetteh@gmail.com | ')
    add_hyperlink(contact, 'LinkedIn', 'https://www.linkedin.com/in/julius-tetteh/')
    contact.add_run(' | ')
    add_hyperlink(contact, 'GitHub', 'https://github.com/j-tee')
    contact.add_run(' | ')
    add_hyperlink(contact, 'Portfolio', 'https://profile.alphalogiquetechnologies.com/')
    contact.runs[0].font.size = Pt(9)
    contact.paragraph_format.space_after = Pt(6)
    
    # ========== PROFESSIONAL SUMMARY ==========
    summary_heading = doc.add_paragraph()
    summary_run = summary_heading.add_run('PROFESSIONAL SUMMARY')
    summary_run.font.size = Pt(11)
    summary_run.font.bold = True
    summary_run.font.color.rgb = RGBColor(0, 70, 140)
    summary_heading.paragraph_format.space_after = Pt(3)
    
    summary = doc.add_paragraph()
    summary_text = summary.add_run(
        'Full-Stack Developer with 10+ years managing two production SaaS platforms: School Management System (500+ schools, 50K+ students, 99.9% uptime) '
        'and cloud-based POS System with multi-location support. Expert in React, Ruby on Rails, Django, PostgreSQL. Achieved 95% client retention, '
        '30% code quality improvement, and mentored 50+ developers.'
    )
    summary_text.font.size = Pt(9)
    summary.paragraph_format.space_after = Pt(6)
    
    # ========== TECHNICAL SKILLS ==========
    skills_heading = doc.add_paragraph()
    skills_run = skills_heading.add_run('TECHNICAL SKILLS')
    skills_run.font.size = Pt(11)
    skills_run.font.bold = True
    skills_run.font.color.rgb = RGBColor(0, 70, 140)
    skills_heading.paragraph_format.space_after = Pt(3)
    
    skills = doc.add_paragraph()
    skills_text = skills.add_run(
        'Frontend: React.js, Redux, JavaScript (ES6+), TypeScript, HTML5, CSS3 | '
        'Backend: Ruby on Rails, Django, Node.js, RESTful APIs | '
        'Databases: PostgreSQL, MySQL, Redis, Django ORM | '
        'DevOps: Docker, Git, CI/CD, Linux | '
        'SaaS: Multi-tenant architecture, Stripe/PayPal integration, performance optimization | '
        'Security: OAuth 2.0, JWT, data encryption'
    )
    skills_text.font.size = Pt(9)
    skills.paragraph_format.space_after = Pt(6)
    
    # ========== PROFESSIONAL EXPERIENCE ==========
    exp_heading = doc.add_paragraph()
    exp_run = exp_heading.add_run('PROFESSIONAL EXPERIENCE')
    exp_run.font.size = Pt(11)
    exp_run.font.bold = True
    exp_run.font.color.rgb = RGBColor(0, 70, 140)
    exp_heading.paragraph_format.space_after = Pt(3)
    
    # Job 1
    job1 = doc.add_paragraph()
    job1_run = job1.add_run('Freelance Full-Stack Developer & SaaS Solutions Architect | Self-Employed')
    job1_run.font.size = Pt(10)
    job1_run.font.bold = True
    job1.add_run(' | 2023 - Present').font.size = Pt(9)
    job1.paragraph_format.space_after = Pt(2)
    
    job1_bullets = [
        'Built School Management SaaS (sdms.alphalogiquetechnologies.com) serving 500+ schools with 50K+ students at 99.9% uptime',
        'Developed enrollment system, grade management, real-time analytics, automated reporting, and parent portal (75% engagement increase)',
        'Built cloud-based POS SaaS (pos.alphalogiquetechnologies.com) with inventory, sales analytics, payment processing, multi-location support',
        'Implemented enterprise RBAC, integrated payment gateways (Stripe/PayPal), achieving 95% client retention',
        'Optimized for 50K+ concurrent users with sub-second response times, saving clients 100+ hours monthly'
    ]
    
    for bullet in job1_bullets:
        p = doc.add_paragraph(bullet, style='List Bullet')
        p.runs[0].font.size = Pt(9)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.left_indent = Inches(0.25)
    
    # Job 2
    job2 = doc.add_paragraph()
    job2_run = job2.add_run('Head of IT | Standard Academy')
    job2_run.font.size = Pt(10)
    job2_run.font.bold = True
    job2.add_run(' | 2015 - Present').font.size = Pt(9)
    job2.paragraph_format.space_after = Pt(2)
    job2.paragraph_format.space_before = Pt(3)
    
    job2_bullets = [
        'Architected full-stack web platform serving 150+ students with real-time analytics, improving performance by 35%',
        'Built parent portal increasing engagement by 60%, reduced manual data entry by 70% through automation'
    ]
    
    for bullet in job2_bullets:
        p = doc.add_paragraph(bullet, style='List Bullet')
        p.runs[0].font.size = Pt(9)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.left_indent = Inches(0.25)
    
    # Job 3
    job3 = doc.add_paragraph()
    job3_run = job3.add_run('Head of IT | Delight International School')
    job3_run.font.size = Pt(10)
    job3_run.font.bold = True
    job3.add_run(' | 2005 - 2015').font.size = Pt(9)
    job3.paragraph_format.space_after = Pt(2)
    job3.paragraph_format.space_before = Pt(3)
    
    job3_bullets = [
        'Designed IT infrastructure supporting 200+ users, maintained 95% uptime, reduced resolution time by 40%',
        'Implemented security protocols reducing incidents by 50%, managed $50K+ budget reducing costs by 15%'
    ]
    
    for bullet in job3_bullets:
        p = doc.add_paragraph(bullet, style='List Bullet')
        p.runs[0].font.size = Pt(9)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.left_indent = Inches(0.25)
    
    # Job 4
    job4 = doc.add_paragraph()
    job4_run = job4.add_run('Volunteer Full-Stack Developer | Microverse')
    job4_run.font.size = Pt(10)
    job4_run.font.bold = True
    job4.add_run(' | 2023 - Present').font.size = Pt(9)
    job4.paragraph_format.space_after = Pt(2)
    job4.paragraph_format.space_before = Pt(3)
    
    job4_bullets = [
        'Mentored 20+ developers monthly, conducted code reviews improving quality by 30%, reducing bugs by 25%'
    ]
    
    for bullet in job4_bullets:
        p = doc.add_paragraph(bullet, style='List Bullet')
        p.runs[0].font.size = Pt(9)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.left_indent = Inches(0.25)
    
    # ========== EDUCATION ==========
    edu_heading = doc.add_paragraph()
    edu_run = edu_heading.add_run('EDUCATION')
    edu_run.font.size = Pt(11)
    edu_run.font.bold = True
    edu_run.font.color.rgb = RGBColor(0, 70, 140)
    edu_heading.paragraph_format.space_after = Pt(3)
    edu_heading.paragraph_format.space_before = Pt(6)
    
    edu1 = doc.add_paragraph()
    edu1.add_run('Web Development Full-Stack Program').font.bold = True
    edu1.add_run(' | Microverse | 2023')
    edu1.runs[0].font.size = Pt(9)
    edu1.paragraph_format.space_after = Pt(1)
    
    edu2 = doc.add_paragraph()
    edu2.add_run('BSc Computer Science').font.bold = True
    edu2.add_run(' | Regent University College | 2016')
    edu2.runs[0].font.size = Pt(9)
    edu2.paragraph_format.space_after = Pt(1)
    
    edu3 = doc.add_paragraph()
    edu3.add_run('Diploma in e-Computing').font.bold = True
    edu3.add_run(' | NIIT | 2004')
    edu3.runs[0].font.size = Pt(9)
    edu3.paragraph_format.space_after = Pt(6)
    
    # ========== KEY ACHIEVEMENTS ==========
    achieve_heading = doc.add_paragraph()
    achieve_run = achieve_heading.add_run('KEY ACHIEVEMENTS')
    achieve_run.font.size = Pt(11)
    achieve_run.font.bold = True
    achieve_run.font.color.rgb = RGBColor(0, 70, 140)
    achieve_heading.paragraph_format.space_after = Pt(3)
    
    achievements = doc.add_paragraph()
    achievements_text = achievements.add_run(
        '• SaaS platform: 500+ schools, 50K+ students, 99.9% uptime, 95% retention '
        '• Optimized for 50K+ concurrent users with sub-second response times '
        '• Automated reporting saving 100+ hours monthly '
        '• Improved code quality 30%, student performance 35%'
    )
    achievements_text.font.size = Pt(9)
    achievements.paragraph_format.space_after = Pt(6)
    
    # ========== CERTIFICATIONS ==========
    cert_heading = doc.add_paragraph()
    cert_run = cert_heading.add_run('CERTIFICATIONS')
    cert_run.font.size = Pt(11)
    cert_run.font.bold = True
    cert_run.font.color.rgb = RGBColor(0, 70, 140)
    cert_heading.paragraph_format.space_after = Pt(3)
    
    certs = doc.add_paragraph()
    certs_text = certs.add_run(
        'JavaScript Algorithms & Data Structures (Free Code Camp) | '
        'Ghana Securities Industry Certificate | '
        'Ashesi University Code Fair'
    )
    certs_text.font.size = Pt(9)
    
    # Save document
    doc.save('/home/teejay/Documents/Projects/PeronalProfile/my-profile/Julius_Tetteh_One_Page_Resume.docx')
    print("✅ One-page resume created successfully!")
    print("📄 File saved as: Julius_Tetteh_One_Page_Resume.docx")

if __name__ == '__main__':
    try:
        create_one_page_resume()
    except Exception as e:
        print(f"❌ Error creating resume: {e}")
        import traceback
        traceback.print_exc()
