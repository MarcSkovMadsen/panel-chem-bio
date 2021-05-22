"""Tests of the JSMEEditor"""
# pylint: disable=missing-function-docstring
import panel as pn

from panel_chemistry import JSMEEditor


def test_can_construct():
    JSMEEditor()


def test_jsme_editor_app():
    editor = JSMEEditor(height=250)
    return pn.Column(editor, editor.param.clicks)


if __name__.startswith("bokeh"):
    test_jsme_editor_app().servable()
