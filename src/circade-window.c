/* circade-window.c
*
* Copyright 2020 Alex Holt
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "circade-config.h"
#include "circade-window.h"

struct _CircadeWindow
{
    GtkApplicationWindow  parent_instance;

    /* Template widgets */
    GtkPaned *paned;
    GtkCalendar *calendar;
    GtkTextView *notepad;
    GtkTextView *title;
    JsonParser *parser;
    GString *current_title;
    GString *current_entry;
};

G_DEFINE_TYPE (CircadeWindow, circade_window, GTK_TYPE_APPLICATION_WINDOW)

static size_t
print_data (void *ptr, size_t size, size_t nmemb, void *stream)
{
    GError *error;

    JsonParser *parser = json_parser_new ();

    json_parser_load_from_data (parser, (char*)ptr, strlen((char*)ptr), &error);

    if (error) {
        g_print ("unable to parse %s", error->message);
        g_error_free (error);
    }

    JsonNode *root = json_parser_get_root (parser);
    json_node_get_string (root);

    g_object_unref (parser);
    return size;
}

static GString*
circade_fetch (CircadeWindow *self,
               gint           year,
               gint           month,
               gint           day)
{
    SoupMessage *msg;
    SoupSession *session;
    session = g_object_new (
        SOUP_TYPE_SESSION,
        SOUP_SESSION_ADD_FEATURE_BY_TYPE, SOUP_TYPE_CONTENT_DECODER,
        SOUP_SESSION_ADD_FEATURE_BY_TYPE, SOUP_TYPE_COOKIE_JAR,
        SOUP_SESSION_USER_AGENT, "get ",
        SOUP_SESSION_ACCEPT_LANGUAGE_AUTO, TRUE,
        NULL
    );

    GString *url = g_string_new ("http://localhost:9009");
    g_string_append_printf (url, "/%d/%d/%d", year, month, day);
    msg = soup_message_new ("GET", url->str);

    SoupURI *uri;
    gchar *uri_string;

    uri = soup_uri_new (url->str);
    uri_string = soup_uri_to_string (uri, FALSE);
    soup_uri_free (uri);

    soup_session_send_message (session, msg);

    GString *res = g_string_new(msg->response_body->data);

    g_free (uri_string);
    g_string_free (url, FALSE);
    g_object_unref (session);
    g_object_unref (msg);

    return res;
}

static void
circade_parse_response (CircadeWindow *self, GString *res)
{
    //g_print ("%s", self->current_entry);
    JsonParser *parser = json_parser_new ();
    GError *error = NULL;

    //g_print ("%s", self->current_entry);
    json_parser_load_from_data (parser, res->str, -1, &error);

    if (error) {
        g_print ("unable to parse %s", error->message);
        g_error_free (error);
    }

    JsonNode *root = json_parser_get_root (parser);
    JsonObject *object = json_node_get_object (root);
    const gchar *title = json_object_get_string_member (object, "title");
    const gchar *entry = json_object_get_string_member (object, "entry");

    g_string_printf (self->current_title, "%s", title);
    g_string_printf (self->current_entry, "%s", entry);
}

static void
circade_update_date (GtkCalendar *calendar, gpointer self)
{
    guint year, month, day;
    CircadeWindow *circade_window = CIRCADE_WINDOW (self);

    gtk_calendar_get_date(calendar, &year, &month, &day);

    //GString *date_str = g_string_new("");
    //g_string_printf (date_str, "%d-%d-%d", year, ++month, day);
    //g_print("%s", date_str->str);

    GString *res = circade_fetch (circade_window, year, month, day);
    g_print("%s", res->str);
    circade_parse_response (circade_window, res);

    GtkTextView *title = circade_window->title;
    GtkTextView *notepad = circade_window->notepad;

    gtk_text_buffer_set_text (
        gtk_text_view_get_buffer (GTK_TEXT_VIEW(title)),
        circade_window->current_title->str,
        circade_window->current_title->len
    );

    gtk_text_buffer_set_text (
        gtk_text_view_get_buffer (GTK_TEXT_VIEW(notepad)),
        circade_window->current_entry->str,
        circade_window->current_entry->len
    );
    //g_string_free (date_str, TRUE);
}

static void
circade_connect_signals(CircadeWindow *self)
{
    g_signal_connect (self->calendar, "day-selected", G_CALLBACK (circade_update_date), self);
}


static void
circade_window_class_init (CircadeWindowClass *klass)
{
    GtkWidgetClass *widget_class = GTK_WIDGET_CLASS (klass);

    gtk_widget_class_set_template_from_resource (widget_class, "/me/alexholt/Circade/circade-window.ui");
    gtk_widget_class_bind_template_child (widget_class, CircadeWindow, paned);
    gtk_widget_class_bind_template_child (widget_class, CircadeWindow, calendar);
    gtk_widget_class_bind_template_child (widget_class, CircadeWindow, title);
    gtk_widget_class_bind_template_child (widget_class, CircadeWindow, notepad);
}

static void
circade_window_init (CircadeWindow *self)
{
    gtk_widget_init_template (GTK_WIDGET (self));
    GtkTextBuffer *buffer = gtk_text_view_get_buffer (self->title);
    GtkTextBuffer *note_buffer = gtk_text_view_get_buffer (self->notepad);

    self->current_title = g_string_new("");
    self->current_entry = g_string_new("");

    gtk_text_buffer_set_text (buffer, "WHAT", 4);
    gtk_text_buffer_set_text (note_buffer, "NOTE", 4);
    circade_connect_signals (self);
}
