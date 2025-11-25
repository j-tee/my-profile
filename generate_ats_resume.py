#!/usr/bin/env python3
"""
Generate ATS-Compatible Resume in DOCX format
This script creates a professionally formatted resume optimized for Applicant Tracking Systems
"""

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
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
    
    # Style for hyperlink
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

def set_cell_margins(cell, top=50, start=50, bottom=50, end=50):
    """Set cell margins"""
    tc = cell._element
    tcPr = tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    
    for margin_name, margin_value in [('top', top), ('start', start), ('bottom', bottom), ('end', end)]:
        node = OxmlElement(f'w:{margin_name}')
        node.set(qn('w:w'), str(margin_value))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    
    tcPr.append(tcMar)

def create_resume():
    """Create the ATS-optimized resume"""
    doc = Document()
    
    # Set document margins (0.5 inch all around for ATS compatibility)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)
        section.left_margin = Inches(0.5)
        section.right_margin = Inches(0.5)
    
    # ========== HEADER ==========
    # Name
    name = doc.add_paragraph()
    name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    name_run = name.add_run('JULIUS R.K TETTEH')
    name_run.font.size = Pt(20)
    name_run.font.bold = True
    name_run.font.color.rgb = RGBColor(0, 0, 0)
    
    # Title
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run('Full-Stack Web Developer')
    title_run.font.size = Pt(14)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(50, 50, 50)
    
    # Contact Info
    contact = doc.add_paragraph()
    contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    contact_run = contact.add_run('Accra, Ghana | +233203344991 | +233546793839\njuliustetteh@gmail.com')
    contact_run.font.size = Pt(10)
    
    # Links
    links = doc.add_paragraph()
    links.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_hyperlink(links, 'LinkedIn', 'https://www.linkedin.com/in/julius-tetteh/')
    links.add_run(' | ')
    add_hyperlink(links, 'GitHub', 'https://github.com/j-tee')
    links.add_run(' | ')
    add_hyperlink(links, 'Portfolio', 'https://profile.alphalogiquetechnologies.com/')
    
    # Horizontal line
    doc.add_paragraph('_' * 80)
    
    # ========== PROFESSIONAL SUMMARY ==========
    summary_heading = doc.add_paragraph()
    summary_run = summary_heading.add_run('PROFESSIONAL SUMMARY')
    summary_run.font.size = Pt(14)
    summary_run.font.bold = True
    summary_run.font.color.rgb = RGBColor(0, 70, 140)
    
    summary_text = doc.add_paragraph()
    summary_text.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    summary_run = summary_text.add_run(
        'Results-driven Full-Stack Web Developer and SaaS Solutions Architect with 10+ years of IT leadership experience and expertise in '
        'enterprise-level application development. Currently managing two production SaaS platforms: School Management System serving 500+ schools '
        'with 50,000+ students (99.9% uptime) and cloud-based POS system with multi-location support. Proven track record of leading technical teams, '
        'developing scalable web applications, and implementing robust IT infrastructure. Expert in React, Ruby on Rails, Django, PostgreSQL, and '
        'microservices architecture. Successfully mentored 50+ developers, improved code quality by 30%, and achieved 95% client retention through '
        'exceptional technical delivery and support.'
    )
    summary_run.font.size = Pt(11)
    
    doc.add_paragraph()
    
    # ========== CORE COMPETENCIES & TECHNICAL SKILLS ==========
    skills_heading = doc.add_paragraph()
    skills_run = skills_heading.add_run('CORE COMPETENCIES & TECHNICAL SKILLS')
    skills_run.font.size = Pt(14)
    skills_run.font.bold = True
    skills_run.font.color.rgb = RGBColor(0, 70, 140)
    
    # Create skills table
    skills_data = [
        ('Programming & Frameworks', 
         'Frontend: React.js, Redux, JavaScript (ES6+), TypeScript, HTML5, CSS3, AngularJS, Responsive Design\n'
         'Backend: Ruby on Rails, Django, Node.js, .NET Core, RESTful APIs, Web API, Microservices\n'
         'Languages: Python, Ruby, JavaScript, Java, C#, C++, SQL'),
        
        ('Database & Infrastructure',
         'Databases: PostgreSQL, MySQL, MongoDB, MSSQL, Redis, Django ORM, Entity Framework, Database Optimization\n'
         'DevOps & Tools: Docker, CI/CD Pipelines, Git, GitHub, GitFlow, Linux Server Administration\n'
         'Security: OAuth 2.0, JWT, Data Encryption, Network Security, Firewall Configuration'),
        
        ('SaaS & Enterprise Solutions',
         'SaaS Architecture: Multi-tenant design, subscription management, usage metering, billing automation\n'
         'Payment Integration: Stripe, PayPal, automated invoicing, recurring billing\n'
         'Performance: Load balancing, caching (Redis), database optimization, query optimization\n'
         'Monitoring: Real-time dashboards, user behavior tracking, system health monitoring'),
        
        ('Development Practices',
         'Methodologies: Agile/Scrum, Test-Driven Development (TDD), Remote Pair Programming\n'
         'Architecture: MVC Pattern, RESTful Design, API Development, Performance Optimization\n'
         'Collaboration: Cross-Functional Teams, Technical Mentoring, Code Reviews')
    ]
    
    for category, skills in skills_data:
        # Category
        cat_para = doc.add_paragraph()
        cat_run = cat_para.add_run(category)
        cat_run.font.size = Pt(11)
        cat_run.font.bold = True
        
        # Skills
        skills_para = doc.add_paragraph(skills)
        skills_para.left_indent = Inches(0.25)
        for run in skills_para.runs:
            run.font.size = Pt(10)
    
    doc.add_paragraph()
    
    # ========== PROFESSIONAL EXPERIENCE ==========
    exp_heading = doc.add_paragraph()
    exp_run = exp_heading.add_run('PROFESSIONAL EXPERIENCE')
    exp_run.font.size = Pt(14)
    exp_run.font.bold = True
    exp_run.font.color.rgb = RGBColor(0, 70, 140)
    
    # Job 1 - Freelancing
    job1_title = doc.add_paragraph()
    job1_title_run = job1_title.add_run('Freelance Full-Stack Developer & SaaS Solutions Architect | Self-Employed')
    job1_title_run.font.size = Pt(11)
    job1_title_run.font.bold = True
    
    job1_date = doc.add_paragraph('2023 - Present')
    job1_date.runs[0].font.size = Pt(10)
    job1_date.runs[0].font.italic = True
    
    job1_bullets = [
        'SaaS School Management Platform (sdms.alphalogiquetechnologies.com): Architecting and managing comprehensive SaaS serving 500+ schools with 50,000+ students, achieving 99.9% uptime',
        'Platform Features: Built student enrollment, academic management, real-time analytics, fee tracking with payment integration, and automated reporting',
        'Role-Based Access Control: Implemented enterprise RBAC supporting multiple user roles (admins, teachers, students, parents) with granular permissions',
        'Parent Portal: Designed parent portal enabling real-time access to grades, attendance, and progress reports, improving engagement by 75%',
        'SaaS POS System (pos.alphalogiquetechnologies.com): Developing cloud-based Point-of-Sale with inventory management, sales analytics, and multi-location support',
        'Scalability: Optimized databases and caching, enabling platform to handle 50K+ concurrent users with sub-second response times',
        'Automated Reporting: Built report generation system producing transcripts and analytics, saving 100+ hours monthly',
        'Technical Stack: React.js, TypeScript, Ruby on Rails, Django, PostgreSQL, Redis, Docker, Stripe/PayPal integration',
        'Client Success: Achieved 95% retention rate and 4.8/5.0 satisfaction score through responsive support'
    ]
    
    for bullet in job1_bullets:
        p = doc.add_paragraph(bullet, style='List Bullet')
        p.runs[0].font.size = Pt(10)
    
    doc.add_paragraph()
    
    # Job 2 - Microverse
    job2_title = doc.add_paragraph()
    job2_title_run = job2_title.add_run('Volunteer Full-Stack Developer (Remote Part-time) | Microverse')
    job2_title_run.font.size = Pt(11)
    job2_title_run.font.bold = True
    
    job2_date = doc.add_paragraph('2023 - Present')
    job2_date.runs[0].font.size = Pt(10)
    job2_date.runs[0].font.italic = True
    
    job2_bullets = [
        'Mentor 20+ junior developers monthly, conducting code reviews improving quality by 30% and reducing bugs by 25%',
        'Optimize application architecture, reducing complexity by 20% and improving performance by 35%',
        'Develop motivation strategies achieving 40% increase in program completion rates',
        'Collaborate with international teams using Agile methodologies and daily stand-ups'
    ]
    
    for bullet in job2_bullets:
        p = doc.add_paragraph(bullet, style='List Bullet')
        p.runs[0].font.size = Pt(10)
    
    doc.add_paragraph()
    
    # Job 3 - Standard Academy
    job3_title = doc.add_paragraph()
    job3_title_run = job3_title.add_run('Head of IT | Standard Academy')
    job3_title_run.font.size = Pt(11)
    job3_title_run.font.bold = True
    
    job3_date = doc.add_paragraph('2015 - Present')
    job3_date.runs[0].font.size = Pt(10)
    job3_date.runs[0].font.italic = True
    
    job3_bullets = [
        'Web Platform: Architected full-stack application serving 150+ students with 99.5% uptime',
        'Analytics Dashboard: Built real-time analytics improving student performance by 35%',
        'Parent Portal: Developed secure portal increasing engagement by 60%',
        'System Integration: Streamlined workflows reducing manual data entry by 70%'
    ]
    
    for bullet in job3_bullets:
        p = doc.add_paragraph(bullet, style='List Bullet')
        p.runs[0].font.size = Pt(10)
    
    doc.add_paragraph()
    
    # Job 4 - Delight International
    job4_title = doc.add_paragraph()
    job4_title_run = job4_title.add_run('Head of IT | Delight International School')
    job4_title_run.font.size = Pt(11)
    job4_title_run.font.bold = True
    
    job4_date = doc.add_paragraph('2005 - 2015')
    job4_date.runs[0].font.size = Pt(10)
    job4_date.runs[0].font.italic = True
    
    job4_bullets = [
        'IT Infrastructure: Designed enterprise infrastructure supporting 200+ students and staff',
        'Network Security: Established security protocols achieving 50% reduction in incidents',
        'Technical Support: Maintained 95% uptime, reducing resolution time by 40%',
        'Budget Management: Managed $50K+ budget, reducing costs by 15% while upgrading infrastructure'
    ]
    
    for bullet in job4_bullets:
        p = doc.add_paragraph(bullet, style='List Bullet')
        p.runs[0].font.size = Pt(10)
    
    doc.add_paragraph()
    
    # ========== EDUCATION ==========
    edu_heading = doc.add_paragraph()
    edu_run = edu_heading.add_run('EDUCATION')
    edu_run.font.size = Pt(14)
    edu_run.font.bold = True
    edu_run.font.color.rgb = RGBColor(0, 70, 140)
    
    # Education 1
    edu1 = doc.add_paragraph()
    edu1_run = edu1.add_run('Web Development Full-Stack Program | Microverse')
    edu1_run.font.size = Pt(11)
    edu1_run.font.bold = True
    
    edu1_date = doc.add_paragraph('San Francisco, USA (Remote) | June 2023')
    edu1_date.runs[0].font.size = Pt(10)
    edu1_date.runs[0].font.italic = True
    
    edu1_details = doc.add_paragraph(
        '• 1500+ hours intensive full-stack bootcamp • Built 15+ applications using Ruby on Rails, React, Redux\n'
        '• Mastered algorithms, data structures, and design patterns • Remote pair programming with 30+ countries'
    )
    edu1_details.runs[0].font.size = Pt(10)
    
    # Education 2
    edu2 = doc.add_paragraph()
    edu2_run = edu2.add_run('BSc Computer Science | Regent University College of Science and Technology')
    edu2_run.font.size = Pt(11)
    edu2_run.font.bold = True
    
    edu2_date = doc.add_paragraph('Accra, Ghana | April 2016')
    edu2_date.runs[0].font.size = Pt(10)
    edu2_date.runs[0].font.italic = True
    
    edu2_details = doc.add_paragraph(
        '• Core: Data Structures, Algorithms, Database Systems, Networks, Software Engineering, Machine Learning\n'
        '• Programming: Java, C++, C#, Python • 2000+ hours hands-on projects and practical experience'
    )
    edu2_details.runs[0].font.size = Pt(10)
    
    # Education 3
    edu3 = doc.add_paragraph()
    edu3_run = edu3.add_run('Diploma in e-Computing | NIIT')
    edu3_run.font.size = Pt(11)
    edu3_run.font.bold = True
    
    edu3_date = doc.add_paragraph('Accra, Ghana | December 2004')
    edu3_date.runs[0].font.size = Pt(10)
    edu3_date.runs[0].font.italic = True
    
    edu3_details = doc.add_paragraph('• Software development, database management, C# programming, .NET framework')
    edu3_details.runs[0].font.size = Pt(10)
    
    doc.add_paragraph()
    
    # ========== CERTIFICATIONS ==========
    cert_heading = doc.add_paragraph()
    cert_run = cert_heading.add_run('CERTIFICATIONS & PROFESSIONAL DEVELOPMENT')
    cert_run.font.size = Pt(14)
    cert_run.font.bold = True
    cert_run.font.color.rgb = RGBColor(0, 70, 140)
    
    certifications = [
        'Ghana Securities Industry Certificate | Ghana Stock Exchange | December 2017',
        'Certificate of Participation | Ashesi University Code Fair | October 2013',
        'JavaScript Algorithms and Data Structures | Free Code Camp | July 2022'
    ]
    
    for cert in certifications:
        p = doc.add_paragraph(f'• {cert}')
        p.runs[0].font.size = Pt(10)
    
    doc.add_paragraph()
    
    # ========== KEY ACHIEVEMENTS ==========
    achieve_heading = doc.add_paragraph()
    achieve_run = achieve_heading.add_run('KEY ACHIEVEMENTS & IMPACT')
    achieve_run.font.size = Pt(14)
    achieve_run.font.bold = True
    achieve_run.font.color.rgb = RGBColor(0, 70, 140)
    
    achievements = [
        'SaaS Platform Success: Built School Management SaaS serving 500+ schools with 50K+ students at 99.9% uptime, achieving 95% client retention',
        'Enterprise Scalability: Optimized platform to handle 50,000+ concurrent users with sub-second response times',
        'Automated Efficiency: Developed automated reporting saving clients 100+ hours monthly in administrative work',
        'Enhanced code quality by 30% and reduced bug rates by 25% through comprehensive mentorship programs',
        'Improved application performance by 35% and reduced complexity by 20% through architecture optimization',
        'Maintained 95-99.9% system uptime serving 50K+ concurrent users across multiple platforms'
    ]
    
    for achievement in achievements:
        p = doc.add_paragraph(f'• {achievement}')
        p.runs[0].font.size = Pt(10)
    
    # Save document
    doc.save('/home/teejay/Documents/Projects/PeronalProfile/my-profile/Julius_Tetteh_ATS_Resume.docx')
    print("✅ ATS-optimized resume created successfully!")
    print("📄 File saved as: Julius_Tetteh_ATS_Resume.docx")

if __name__ == '__main__':
    try:
        create_resume()
    except Exception as e:
        print(f"❌ Error creating resume: {e}")
        import traceback
        traceback.print_exc()
