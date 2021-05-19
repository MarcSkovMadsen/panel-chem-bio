# panel-chem-bio

The purpose of the panel-chem-bio project is to make it really easy to work with EDA and create awesome visual tools within the domains of Chemistry and Molecular Biology and using [Panel](https://panel.holoviz.org).

THIS PROJECT IS JUST STARTING (2021-05-19) AND NOTHING MORE THAN AN IDEA. It was started the discussion [How to display JSME molecular editor with Panel?](https://discourse.holoviz.org/t/how-to-display-jsme-molecular-editor-with-panel/2306/12) in the [Panel Community Forum](https://discourse.holoviz.org/)

## Getting Started

`pip install panel_chem_bio`

```python
import panel_chem_bio as pc
import panel as pn

pn.extension("jsme", sizing_mode="stretch_width)

editor = pc.JSMEEditor(height=800)
editor
```

![JSME Editor](https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/JMEEditor2008-2.png/300px-JMEEditor2008-2.png)

## Inspirational Resources

- [Dash Bio](https://dash.plotly.com/dash-bio)
- [Awesome Python Chemistry](https://github.com/lmmentel/awesome-python-chemistry)
