import os
import shutil 

TTI_PATH = "/Users/benclingenpeel/Desktop/Math!/obs_math/Math/Self-study/Topology Through Inquiry/work.pdf"
WEB_TTI_PATH = "/Users/benclingenpeel/Desktop/Projects/website-project/wikis/static/wikis/tti_problems.pdf"

RA_PATH = "/Users/benclingenpeel/Desktop/Georgetown/Spring 2022/MATH 310/Practice Problems/problems.pdf"
WEB_RA_PATH = "/Users/benclingenpeel/Desktop/Projects/website-project/wikis/static/wikis/ua_problems.pdf"

FA_PATH = "/Users/benclingenpeel/Desktop/Georgetown/Spring 2023/MATH 680/Practice Problems/practice.pdf"
WEB_FA_PATH = "/Users/benclingenpeel/Desktop/Projects/website-project/wikis/static/wikis/fa_problems.pdf"

shutil.copy(TTI_PATH, WEB_TTI_PATH)
shutil.copy(RA_PATH, WEB_RA_PATH)
shutil.copy(FA_PATH, WEB_FA_PATH)