data = [
    {"tittle": "General Chairs",
     "people": [{"name": "Wei Zhang", "addr": "Hong Kong Univ. of Science and Technology"},
                {"name": "Jason Xue", "addr": "City Univ. of Hong Kong"},
                {"name": "Zili Shao", "addr": "Hong Kong Polytechnic Univ"}
                ],
     "if-break": True,
     "p-template": """
     <div class="col-2 col-sm-1 text-center">
            <i class="fa fa-black-tie fa-3x bg-color-isvlsi-1" aria-hidden="true"></i></div>
        <div class="col-10 col-sm-5">
        <p><strong>{name}</strong>
               <br>{addr}</p>
         </div>"""}

    , {"tittle": "TPC Chairs",
       "people": [{"name": "Hai Li", "addr": "Duke University, USA"},
                  {"name": "Yu Wang", "addr": "Tsinghua University, China"},
                  {"name": "Wujie Wen", "addr": "Florida International University, USA"}
                  ],
       "if-break": True,
       "p-template": """
     <div class="col-2 col-sm-1 text-center">
            <i class="fa fa-black-tie fa-3x color-isvlsi-2" aria-hidden="true"></i></div>
        <div class="col-10 col-sm-5">
        <p><strong>{name}</strong>
               <br>{addr}</p>
         </div>"""}

    , {"tittle": "Special Session Chairs",
       "people": [{"name": "Bei Yu", "addr": "The Chinese Univ. of Hong Kong"},
                  {"name": "Yuan-Hao Chang", "addr": "Academia Sinica, Taiwan"}
                  ],
       "if-break": True,
       "p-template": """<div class="col-2 col-sm-1 text-center">
            <i class="fa fa-code-fork fa-3x color-isvlsi-3" aria-hidden="true"></i></div>
        <div class="col-10 col-sm-5">
        <p><strong>{name}</strong>
               <br>{addr}</p>
         </div>"""}

    , {"tittle": "Web Chair",
       "people": [{"name": "Theocharis Theocharides", "addr": "University of Cyprus, Cyprus"}
                  ],
       "p-template": """<div class="col-2 col-sm-1 text-center">
     <i class="fa fa-desktop fa-2x" aria-hidden="true"></i></div>
 <div class="col-10 col-sm-5">
 <p><strong>{name}</strong>
        <br>{addr}</p>
  </div>"""}

    , {"tittle": "PhD Forum Chair",
       "people": [{"name": "Aida Todri-Sanial", "addr": "CNRS-LIRMM, France"}
                  ],
       "p-template": """<div class="col-2 col-sm-1 text-center">
    <i class="fa fa-graduation-cap fa-2x " aria-hidden="true"></i></div>
<div class="col-10 col-sm-5">
<p><strong>{name}</strong>
       <br>{addr}</p>
 </div>"""}

    , {"tittle": "Publication Chairs",
       "people": [{"name": "Aida Todri-Sanial", "addr": "CNRS-LIRMM, France"},
                  {"name": "Prasun Ghosal", "addr": "Indian Institute of Engineering, Shibpur"}
                  ],
       "if-break": True,
       "p-template": """<div class="col-2 col-sm-1 text-center">
            <i class="fa fa-book fa-2x color-isvlsi-2" aria-hidden="true"></i></div>
        <div class="col-10 col-sm-5">
        <p><strong>{name}</strong>
               <br>{addr}</p>
         </div>"""
       }

    , {"tittle": "Publicity Chairs",
       "people": [{"name": "Guangyu Sun", "addr": "Peking University, China"},
                  {"name": "Muhammad Shafique", "addr": "Vienna University of Technology, Austria"},
                  {"name": "Jingtong Hu", "addr": "University of Pittsburg, USA"},
                  {"name": "Masaaki Kondo", "addr": "The University of Tokyo, Japan"},
                  {"name": "Chun-Yi Lee", "addr": "National Tsinghua University, Taiwan"},
                  ],
       "if-break": True,
       "p-template": """<div class="col-2 col-sm-1 text-center">
        <i class="fa fa-wifi fa-2x color-isvlsi-blue" aria-hidden="true"></i></div>
    <div class="col-10 col-sm-5">
    <p><strong>{name}</strong>
           <br>{addr}</p>
     </div>"""
       }

    , {"tittle": "Financial Chair",
       "people": [{"name": "Duo Liu", "addr": "Chongqing University, China"}
                  ],
       "p-template": """<div class="col-2 col-sm-1 text-center">
    <i class="fa fa-bar-chart fa-2x" aria-hidden="true"></i></div>
<div class="col-10 col-sm-5">
<p><strong>{name}</strong>
       <br>{addr}</p>
 </div>"""}

    , {"tittle": "Registration Chair",
       "people": [{"name": "Weichen Liu", "addr": "Nanyang Technological University, Singapore"}
                  ],
       "p-template": """<div class="col-2 col-sm-1 text-center">
    <i class="fa fa-registered fa-2x" aria-hidden="true"></i></div>
<div class="col-10 col-sm-5">
<p><strong>{name}</strong>
       <br>{addr}</p>
 </div>"""}


    , {"tittle": "Local Arrangement Chairs",
       "people": [{"name": "Nan Guan", "addr": "Hong Kong Polytechnic University"},
                  {"name": "Ray Chak-Chung Cheung", "addr": "City University of Hong Kong"}
                  ],
       "p-template": """<div class="col-2 col-sm-1 text-center">
    <i class="fa fa-street-view  fa-2x" aria-hidden="true"></i></div>
<div class="col-10 col-sm-5">
<p><strong>{name}</strong>
       <br>{addr}</p>
 </div>"""}

    , {"tittle": "Steering Committee",
       "people": [{"name": u"<em>Chair></em> Jürgen Becker", "addr": "Karlsruhe Institute of Technology, Germany"},
                  {"name": u"<em>Vice-Chair></em> Saraju P. Mohanty", "addr": "University of North Texas, USA"},
                  ],
"if-break": False,
       "p-template": """<div class="col-2 col-sm-1 text-center">
    <i class="fa fa-tachometer fa-2x" aria-hidden="true"></i></div>
<div class="col-10 col-sm-5">
<p><strong>{name}</strong>
       <br>{addr}</p>
 </div>"""}
]

steering_committee_other={
    "list" :[{"name": u"Hai (Helen) Li", "addr": "University of Pittsburgh, USA"},
            {"name": u"Lionel Torres", "addr": "University of Montpellier, France"},
{"name": u"Michael Hübner", "addr": "Ruhr-University of Bochum, Germany"},
             {"name": u"Nikos Voros", "addr": "Technological Educational Institute of Western Greece"},

             {"name": u"Ricardo Reis", "addr": "Universidade Federal do Rio Grande do Sul, Brazil"},

             {"name": u"Sandip Kundu", "addr": "University of Massachusetts, Amherst, USA"},

             {"name": u"Sanjukta Bhanja", "addr": "University of South Florida, USA"},
             {"name": u"Susmita Sur-Kolay", "addr": "Indian Statistical Institute, Kolkata, India"},
             {"name": u"Vijaykrishnan Narayanan", "addr": "Pennsylvanian State University, USA"},

             ],
"template": """
    <div class="col-11 col-md-6 col-lg-4">
        <p><strong>{name}</strong>
         <br>{addr}</p>
    </div>
 """
}


xxx___ = """
{"tittle": "General Chairs",
 "people": [{"name": "", "addr": ""},
                {"name": "", "addr": ""}
                ],
 "p-template": "xxx"
},
"""

sec_tmpt = """<div class="col-12">
                        <h3>{tittle}</h3>
                    </div>
                    {people_list}
"""

sec_break = """
<div class="col-12"><hr/></div>
"""



if __name__=="__main__":
    result = ""
    for sec in data:
        sec_str = ""
        for p in sec["people"]:
            sec_str += sec["p-template"].format(name=p["name"], addr=p["addr"])
        result += sec_tmpt.format(tittle=sec["tittle"], people_list=sec_str)
        if sec.get("if-break", True):
            result += sec_break
    for p in steering_committee_other["list"]:
        result+= steering_committee_other["template"].format(name=p["name"], addr=p["addr"])

    open("about.committee.p.html", "w").write(result)
