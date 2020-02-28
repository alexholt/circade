circade_sources = [
  'main.c',
  'circade-window.c',
  'circade-cookie-jar.c',
]

circade_deps = [
  dependency('gio-2.0', version: '>= 2.50'),
  dependency('gtk+-3.0', version: '>= 3.22'),
  dependency('json-glib-1.0', version: '>= 1.0'),
  dependency('libsoup-2.4', version: '>= 2.66'),
  dependency('libsecret-1', version: '>= 0.2'),
]

gnome = import('gnome')

circade_sources += gnome.compile_resources('circade-resources',
  'circade.gresource.xml',
  c_name: 'circade'
)

executable('circade', circade_sources,
  dependencies: circade_deps,
  install: true,
)
