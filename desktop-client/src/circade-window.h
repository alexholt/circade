/* circade-window.h
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

#pragma once

#include <gtk/gtk.h>
#include <libsoup/soup.h>
#include <json-glib/json-glib.h>

#include "circade-cookie-jar.h"

G_BEGIN_DECLS

#define CIRCADE_TYPE_WINDOW (circade_window_get_type())

G_DECLARE_FINAL_TYPE (CircadeWindow, circade_window, CIRCADE, WINDOW, GtkApplicationWindow)

G_END_DECLS
