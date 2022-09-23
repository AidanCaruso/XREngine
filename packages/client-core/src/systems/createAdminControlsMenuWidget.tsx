import { World } from '@xrengine/engine/src/ecs/classes/World'
import { removeComponent } from '@xrengine/engine/src/ecs/functions/ComponentFunctions'
import { VisibleComponent } from '@xrengine/engine/src/scene/components/VisibleComponent'
import { WidgetName, Widgets } from '@xrengine/engine/src/xrui/Widgets'

import { createAdminControlsMenuView } from './ui/AdminControlsMenuView'

export function createAdminControlsMenuWidget(world: World) {
  const ui = createAdminControlsMenuView()
  removeComponent(ui.entity, VisibleComponent)

  Widgets.registerWidget(world, ui.entity, {
    ui,
    label: WidgetName.ADMIN_CONTROLS,
    system: () => {}
  })
}
