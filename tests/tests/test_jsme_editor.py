"""Tests of the JSMEEditor"""
# pylint: disable=missing-function-docstring
import panel as pn

from panel_chemistry.widgets import JSMEEditor


def test_can_construct(document, comm):
    editor = JSMEEditor()
    widget = editor.get_root(document, comm=comm)
    assert isinstance(widget, editor._widget_type)  # pylint: disable=protected-access


def _create_app():
    pn.extension("jsme", sizing_mode="stretch_width")
    smiles = "N[C@@H](CCC(=O)N[C@@H](CS)C(=O)NCC(=O)O)C(=O)O"
    editor = JSMEEditor(value=smiles, height=500)

    settings = pn.Param(
        editor,
        parameters=[
            "height",
            "width",
            "sizing_mode",
            "subscriptions",
            "format",
            "options",
            "guicolor",
        ],
        widgets={
            "options": {"height": 300},
        },
    )
    values = pn.Param(
        editor,
        parameters=["value", "jme", "smiles", "mol", "mol3000", "sdf"],
        widgets={
            "value": {"type": pn.widgets.TextAreaInput, "height": 200},
            "jme": {"type": pn.widgets.TextAreaInput, "height": 200},
            "smile": {"type": pn.widgets.TextAreaInput, "height": 200},
            "mol": {"type": pn.widgets.TextAreaInput, "height": 200},
            "mol3000": {"type": pn.widgets.TextAreaInput, "height": 200},
            "sdf": {"type": pn.widgets.TextAreaInput, "height": 200},
        },
    )
    return pn.template.FastListTemplate(
        site="Panel Chemistry",
        title="Preliminary JSME Editor",
        main=[editor, values],
        sidebar=[settings],
    )


def test_app():
    assert _create_app()


if __name__.startswith("bokeh"):
    _create_app().servable()
